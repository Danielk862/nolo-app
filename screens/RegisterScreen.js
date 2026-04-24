import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import { supabase } from '../lib/supabase';

const DOC_TYPES = ['CC', 'CE', 'PA', 'TI'];
const GENDERS = [
  { value: 'Masculino', label: 'M' },
  { value: 'Femenino', label: 'F' },
  { value: 'No binario', label: 'NB' },
  { value: 'Prefiero no decir', label: 'N/D' },
];

function ChipSelector({ options, selected, onSelect, valueKey, labelKey }) {
  return (
    <View style={chipStyles.row}>
      {options.map((opt) => {
        const val = valueKey ? opt[valueKey] : opt;
        const lbl = labelKey ? opt[labelKey] : opt;
        const active = selected === val;
        return (
          <TouchableOpacity
            key={val}
            style={[chipStyles.chip, active && chipStyles.chipActive]}
            onPress={() => onSelect(val)}
          >
            <Text style={[chipStyles.chipText, active && chipStyles.chipTextActive]}>
              {lbl}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const chipStyles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.darkGreen,
    backgroundColor: COLORS.primaryGreen,
  },
  chipActive: { backgroundColor: COLORS.darkGreen },
  chipText: { color: COLORS.darkGray, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: COLORS.white },
});

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

const fieldStyles = StyleSheet.create({
  block: { gap: 4 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.darkGray, marginLeft: 4 },
  req: { color: COLORS.red },
  error: { color: COLORS.red, fontSize: 12, marginLeft: 4 },
});

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

  const set = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null, general: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Requerido';
    else if (form.username.length < 3) e.username = 'Mínimo 3 caracteres';
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

    if (form.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(form.birthDate)) {
      e.birthDate = 'Formato: AAAA-MM-DD';
    }

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
      navigation.navigate('Login', { registered: true });
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
                  placeholder="ej: juan_perez"
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
              <ChipSelector
                options={DOC_TYPES}
                selected={form.documentType}
                onSelect={(v) => { set('documentType')(v); }}
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
                  placeholder="+57 300 000 0000"
                  placeholderTextColor={COLORS.gray}
                  value={form.phone}
                  onChangeText={set('phone')}
                  keyboardType="phone-pad"
                />
              </View>
            </Field>

            <Field label="Fecha de nacimiento" error={errors.birthDate}>
              <View style={[styles.inputRow, errors.birthDate && styles.inputRowError]}>
                <TextInput
                  style={styles.input}
                  placeholder="AAAA-MM-DD"
                  placeholderTextColor={COLORS.gray}
                  value={form.birthDate}
                  onChangeText={set('birthDate')}
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
            </Field>

            <Field label="Género" error={errors.gender}>
              <ChipSelector
                options={GENDERS}
                selected={form.gender}
                onSelect={set('gender')}
                valueKey="value"
                labelKey="label"
              />
            </Field>

            <View style={styles.row2}>
              <View style={{ flex: 1 }}>
                <Field label="País" error={errors.country}>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      placeholder="País"
                      placeholderTextColor={COLORS.gray}
                      value={form.country}
                      onChangeText={set('country')}
                    />
                  </View>
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Departamento" error={errors.state}>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      placeholder="Dpto/Estado"
                      placeholderTextColor={COLORS.gray}
                      value={form.state}
                      onChangeText={set('state')}
                    />
                  </View>
                </Field>
              </View>
            </View>

            <Field label="Ciudad" error={errors.city}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Ciudad"
                  placeholderTextColor={COLORS.gray}
                  value={form.city}
                  onChangeText={set('city')}
                />
              </View>
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
            onPress={() => navigation.navigate('Login')}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreen,
  },
  scroll: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  header: {
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.darkGreen,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.lightGreen,
    paddingBottom: SPACING.xs,
  },
  sectionNote: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: -SPACING.sm,
  },
  row2: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primaryGreen,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  inputRowError: {
    borderColor: COLORS.red,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.darkGray,
  },
  alertBox: {
    backgroundColor: '#FDE8E8',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.red,
  },
  alertBoxSuccess: {
    backgroundColor: '#E8F5E9',
    borderLeftColor: COLORS.darkGreen,
  },
  alertText: {
    color: COLORS.red,
    fontSize: 13,
    lineHeight: 20,
  },
  alertTextSuccess: {
    color: COLORS.darkGreen,
  },
  registerBtn: {
    backgroundColor: COLORS.darkGreen,
    paddingVertical: 16,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  registerBtnDisabled: {
    opacity: 0.7,
  },
  registerBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  loginLinkText: {
    color: COLORS.darkGray,
    fontSize: 14,
  },
  loginLinkBold: {
    fontWeight: '700',
    color: COLORS.darkGreen,
    textDecorationLine: 'underline',
  },
});
