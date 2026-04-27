import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  ActivityIndicator, Platform,
  KeyboardAvoidingView, Modal, FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import { supabase } from '../lib/supabase';
import { GeoModel } from '../models';
import styles, { dropStyles, fieldStyles } from '../styles/screens/RegisterScreen.styles';
import { DOC_TYPES } from '../constants/documentTypes';
import { ROUTES } from '../constants/routes';
import { GENDERS } from '../constants/genders';

function Dropdown({ options, value, onSelect, error, placeholder, title, disabled, loading }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const selected = options.find(o => o.value === value);
  const filtered = search
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const handleOpen = () => {
    if (disabled || loading) return;
    setSearch('');
    setOpen(true);
  };

  return (
    <>
      <TouchableOpacity
        style={[dropStyles.btn, error && dropStyles.btnError, (disabled || loading) && dropStyles.btnDisabled]}
        onPress={handleOpen}
        activeOpacity={disabled || loading ? 1 : 0.8}
      >
        <Text style={[dropStyles.btnText, (!selected || disabled) && dropStyles.placeholder]}>
          {loading ? 'Cargando...' : (selected ? selected.label : placeholder)}
        </Text>
        {loading
          ? <ActivityIndicator size="small" color={COLORS.gray} />
          : <Text style={[dropStyles.arrow, disabled && dropStyles.arrowDisabled]}>▾</Text>
        }
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={dropStyles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <View style={dropStyles.sheet} onStartShouldSetResponder={() => true}>
            <Text style={dropStyles.sheetTitle}>{title}</Text>
            {options.length > 8 && (
              <TextInput
                style={dropStyles.searchInput}
                placeholder="Buscar..."
                placeholderTextColor={COLORS.gray}
                value={search}
                onChangeText={setSearch}
              />
            )}
            <FlatList
              data={filtered}
              keyExtractor={item => item.value}
              style={{ maxHeight: 320 }}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item: opt }) => (
                <TouchableOpacity
                  style={[dropStyles.option, value === opt.value && dropStyles.optionActive]}
                  onPress={() => { onSelect(opt.value); setOpen(false); }}
                >
                  <Text style={[dropStyles.optionText, value === opt.value && dropStyles.optionTextActive]}>
                    {opt.label}
                  </Text>
                  {value === opt.value && <Text style={dropStyles.check}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}



function Field({ label, required, error, children }) {
  return (
    <View style={fieldStyles.block}>
      <Text style={fieldStyles.label}>
        {label}
        {required && <Text style={fieldStyles.req}> *</Text>}
      </Text>
      {children}
      {error && <Text style={fieldStyles.error}>{error}</Text>}
    </View>
  );
}


export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    documentType: '',
    documentNumber: '',
    firstName: '',
    secondName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    country: '',
    state: '',
    city: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [countries, setCountries] = useState([]);
  const [geoStates, setGeoStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue] = useState(new Date(2000, 0, 1));

  useEffect(() => {
    GeoModel.getCountries()
      .then(data => {
        setCountries(data ?? []);
      })
      .catch(err => console.error('[GEO] Error países:', err.message, err.code));
  }, []);

  useEffect(() => {
    setGeoStates([]);
    setCities([]);
    if (!form.country) return;
    const country = countries.find(c => c.name === form.country);
    if (!country) return;
    setLoadingStates(true);
    GeoModel.getStatesByCountry(country.id)
      .then(data => { setGeoStates(data); setLoadingStates(false); })
      .catch(err => { console.error('Error cargando estados:', err.message); setLoadingStates(false); });
  }, [form.country, countries]);

  useEffect(() => {
    setCities([]);
    if (!form.state) return;
    const st = geoStates.find(s => s.name === form.state);
    if (!st) return;
    setLoadingCities(true);
    GeoModel.getCitiesByState(st.id)
      .then(data => { setCities(data); setLoadingCities(false); })
      .catch(err => { console.error('Error cargando ciudades:', err.message); setLoadingCities(false); });
  }, [form.state, geoStates]);

  const handleCountrySelect = (name) => {
    setForm(prev => ({ ...prev, country: name, state: '', city: '' }));
    setErrors(prev => ({ ...prev, country: null, state: null, city: null, general: null }));
  };

  const handleStateSelect = (name) => {
    setForm(prev => ({ ...prev, state: name, city: '' }));
    setErrors(prev => ({ ...prev, state: null, city: null, general: null }));
  };

  const set = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null, general: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Requerido';
    else if (form.username.length < 6) e.username = 'Mínimo 6 caracteres';
    else if (/\s/.test(form.username)) e.username = 'Sin espacios';

    if (!form.email.trim()) e.email = 'Requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo inválido';

    if (!form.password) e.password = 'Requerido';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';

    if (!form.confirmPassword) e.confirmPassword = 'Requerido';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';

    if (!form.documentType) e.documentType = 'Selecciona un tipo';
    if (!form.documentNumber.trim()) e.documentNumber = 'Requerido';
    if (!form.firstName.trim()) e.firstName = 'Requerido';
    if (!form.lastName.trim()) e.lastName = 'Requerido';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      // 1. Crear usuario en Supabase Auth
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (signUpError) {
        const msg = signUpError.message.toLowerCase();
        if (msg.includes('already registered') || msg.includes('already been registered')) {
          setErrors({ email: 'Este correo ya está registrado' });
        } else {
          setErrors({ general: signUpError.message });
        }
        return;
      }

      // 2. Insertar perfil usando RPC con SECURITY DEFINER (no requiere sesión activa)
      const { data: result, error: rpcError } = await supabase.rpc('register_user_profile', {
        p_username:        form.username.trim().toLowerCase(),
        p_password:        form.password,
        p_document_type:   form.documentType,
        p_document_number: form.documentNumber.trim(),
        p_first_name:      form.firstName.trim(),
        p_second_name:     form.secondName.trim() || null,
        p_last_name:       form.lastName.trim(),
        p_second_latsname: form.secondLastName.trim() || null,
        p_email:           form.email.trim().toLowerCase(),
        p_phone:           form.phone.trim() || null,
        p_birth_date:      form.birthDate || null,
        p_gender:          form.gender || null,
        p_country:         form.country.trim() || null,
        p_state:           form.state.trim() || null,
        p_city:            form.city.trim() || null,
      });

      if (rpcError) {
        setErrors({ general: rpcError.message });
        return;
      }

      if (!result?.success) {
        const err = result?.error ?? '';
        if (err.includes('document_number')) {
          setErrors({ documentNumber: 'Este número de documento ya está registrado' });
        } else if (err.includes('username')) {
          setErrors({ username: 'Este usuario ya está en uso' });
        } else if (err.includes('email')) {
          setErrors({ email: 'Este correo ya está registrado' });
        } else {
          setErrors({ general: 'Error al guardar los datos. Intenta de nuevo.' });
        }
        return;
      }

      // 3. Cerrar sesión automática (el usuario debe hacer login manualmente)
      await supabase.auth.signOut();

      // 4. Redirigir al login con mensaje de éxito
      navigation.navigate(ROUTES.LOGIN, { registered: true });
    } catch {
      setErrors({ general: 'Error de conexión. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <NoloLogo size="sm" color={COLORS.darkGray} />
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Ingresa tus datos para comenzar</Text>
          </View>

          {/* ── SECCIÓN: Datos de acceso ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos de acceso</Text>

            <Field label="Usuario" required error={errors.username}>
              <View style={[styles.inputRow, errors.username && styles.inputRowError]}>
                <TextInput
                  style={styles.input}
                  placeholder="ej: jperez"
                  placeholderTextColor={COLORS.gray}
                  value={form.username}
                  onChangeText={set('username')}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </Field>

            <Field label="Correo electrónico" required error={errors.email}>
              <View style={[styles.inputRow, errors.email && styles.inputRowError]}>
                <TextInput
                  style={styles.input}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor={COLORS.gray}
                  value={form.email}
                  onChangeText={set('email')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </Field>

            <Field label="Contraseña" required error={errors.password}>
              <View style={[styles.inputRow, errors.password && styles.inputRowError]}>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={COLORS.gray}
                  value={form.password}
                  onChangeText={set('password')}
                  secureTextEntry
                />
              </View>
            </Field>

            <Field label="Confirmar contraseña" required error={errors.confirmPassword}>
              <View style={[styles.inputRow, errors.confirmPassword && styles.inputRowError]}>
                <TextInput
                  style={styles.input}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor={COLORS.gray}
                  value={form.confirmPassword}
                  onChangeText={set('confirmPassword')}
                  secureTextEntry
                />
              </View>
            </Field>
          </View>

          {/* ── SECCIÓN: Información personal ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información personal</Text>

            <Field label="Tipo de documento" required error={errors.documentType}>
              <Dropdown
                options={DOC_TYPES}
                value={form.documentType}
                onSelect={set('documentType')}
                error={errors.documentType}
                placeholder="Selecciona un tipo"
                title="Tipo de documento"
              />
            </Field>

            <Field label="Número de documento" required error={errors.documentNumber}>
              <View style={[styles.inputRow, errors.documentNumber && styles.inputRowError]}>
                <TextInput
                  style={styles.input}
                  placeholder="Número de documento"
                  placeholderTextColor={COLORS.gray}
                  value={form.documentNumber}
                  onChangeText={set('documentNumber')}
                  keyboardType="number-pad"
                />
              </View>
            </Field>

            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <Field label="Primer nombre" required error={errors.firstName}>
                  <View style={[styles.inputRow, errors.firstName && styles.inputRowError]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre"
                      placeholderTextColor={COLORS.gray}
                      value={form.firstName}
                      onChangeText={set('firstName')}
                    />
                  </View>
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Segundo nombre" error={errors.secondName}>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      placeholder="Opcional"
                      placeholderTextColor={COLORS.gray}
                      value={form.secondName}
                      onChangeText={set('secondName')}
                    />
                  </View>
                </Field>
              </View>
            </View>

            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <Field label="Primer apellido" required error={errors.lastName}>
                  <View style={[styles.inputRow, errors.lastName && styles.inputRowError]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Apellido"
                      placeholderTextColor={COLORS.gray}
                      value={form.lastName}
                      onChangeText={set('lastName')}
                    />
                  </View>
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Segundo apellido" error={errors.secondLastName}>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      placeholder="Opcional"
                      placeholderTextColor={COLORS.gray}
                      value={form.secondLastName}
                      onChangeText={set('secondLastName')}
                    />
                  </View>
                </Field>
              </View>
            </View>
          </View>

          {/* ── SECCIÓN: Datos adicionales ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos adicionales</Text>
            <Text style={styles.sectionNote}>Todos opcionales</Text>

            <Field label="Teléfono" error={errors.phone}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="+57 310 548 8700"
                  placeholderTextColor={COLORS.gray}
                  value={form.phone}
                  onChangeText={set('phone')}
                  keyboardType="phone-pad"
                />
              </View>
            </Field>

            <Field label="Fecha de nacimiento" error={errors.birthDate}>
              <TouchableOpacity
                style={[styles.inputRow, errors.birthDate && styles.inputRowError]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
              >
                <Text style={[styles.input, !form.birthDate && { color: COLORS.gray }]}>
                  {form.birthDate || 'Selecciona una fecha'}
                </Text>
                <Text style={{ fontSize: 18, color: COLORS.darkGray }}>📅</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dateValue}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                  onChange={(_, selected) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selected) {
                      setDateValue(selected);
                      const y = selected.getFullYear();
                      const m = String(selected.getMonth() + 1).padStart(2, '0');
                      const d = String(selected.getDate()).padStart(2, '0');
                      set('birthDate')(`${y}-${m}-${d}`);
                    }
                  }}
                />
              )}
            </Field>

            <Field label="Género" error={errors.gender}>
              <Dropdown
                options={GENDERS}
                value={form.gender}
                onSelect={set('gender')}
                error={errors.gender}
                placeholder="Selecciona un género"
                title="Género"
              />
            </Field>

            <Field label="País" error={errors.country}>
              <Dropdown
                options={countries.map(c => ({ value: c.name, label: c.name }))}
                value={form.country}
                onSelect={handleCountrySelect}
                error={errors.country}
                placeholder="Selecciona un país"
                title="País"
              />
            </Field>

            <Field label="Departamento / Estado" error={errors.state}>
              <Dropdown
                options={geoStates.map(s => ({ value: s.name, label: s.name }))}
                value={form.state}
                onSelect={handleStateSelect}
                error={errors.state}
                placeholder={'Selecciona un departamento'}
                title="Departamento / Estado"
                disabled={!form.country}
                loading={loadingStates}
              />
            </Field>

            <Field label="Ciudad" error={errors.city}>
              <Dropdown
                options={cities.map(c => ({ value: c.name, label: c.name }))}
                value={form.city}
                onSelect={set('city')}
                error={errors.city}
                placeholder={'Selecciona una ciudad'}
                title="Ciudad"
                disabled={!form.state}
                loading={loadingCities}
              />
            </Field>
          </View>

          {errors.general && (
            <View style={[styles.alertBox, errors.general.includes('exitoso') && styles.alertBoxSuccess]}>
              <Text style={[styles.alertText, errors.general.includes('exitoso') && styles.alertTextSuccess]}>
                {errors.general}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={COLORS.white} />
              : <Text style={styles.registerBtnText}>Crear cuenta</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate(ROUTES.LOGIN)}
          >
            <Text style={styles.loginLinkText}>
              ¿Ya tienes cuenta?{' '}
              <Text style={styles.loginLinkBold}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

