import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { supabase } from '../lib/supabase';
import { ROUTES } from '../constants/routes';
import { COLORS } from '../constants/theme';
import styles from '../styles/screens/ChangePasswordScreen.styles';

function EyeIcon({ open, size = 20, color = COLORS.darkGreen }) {
  if (open) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
          stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        />
        <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={2} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
        stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      />
      <Path d="M1 1l22 22" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default function ChangePasswordScreen({ navigation }) {
  const [password, setPassword]         = useState('');
  const [confirm, setConfirm]           = useState('');
  const [showPass, setShowPass]         = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [errors, setErrors]             = useState({});
  const [loading, setLoading]           = useState(false);

  const minLength  = password.length >= 8;
  const hasNumber  = /\d/.test(password);
  const matches    = password === confirm && confirm.length > 0;

  const validate = () => {
    const e = {};
    if (!minLength || !hasNumber) e.password = 'La contraseña no cumple los requisitos';
    if (!confirm)                 e.confirm  = 'Confirma tu nueva contraseña';
    else if (password !== confirm) e.confirm = 'Las contraseñas no coinciden';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await supabase.auth.signOut();
      navigation.reset({ index: 0, routes: [{ name: ROUTES.LOGIN }] });
    } catch (e) {
      setErrors({ general: e?.message || 'Error al guardar. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>🔒</Text>
        </View>

        <Text style={styles.title}>Crea tu nueva contraseña</Text>
        <Text style={styles.subtitle}>
          Elige una contraseña segura. La usarás desde ahora para iniciar sesión.
        </Text>

        {/* Nueva contraseña */}
        <View style={styles.fieldBlock}>
          <View style={[styles.inputRow, errors.password && styles.inputRowError]}>
            <TextInput
              style={styles.input}
              placeholder="Nueva contraseña"
              placeholderTextColor="#AAAAAA"
              value={password}
              onChangeText={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: null })); }}
              secureTextEntry={!showPass}
              autoFocus
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPass((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <EyeIcon open={showPass} />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        {/* Indicadores de requisitos */}
        <View style={styles.rulesList}>
          <Text style={[styles.ruleText, minLength && styles.ruleOk]}>
            {minLength ? '✓' : '·'} Mínimo 8 caracteres
          </Text>
          <Text style={[styles.ruleText, hasNumber && styles.ruleOk]}>
            {hasNumber ? '✓' : '·'} Al menos un número
          </Text>
        </View>

        {/* Confirmar contraseña */}
        <View style={styles.fieldBlock}>
          <View style={[styles.inputRow, errors.confirm && styles.inputRowError]}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              placeholderTextColor="#AAAAAA"
              value={confirm}
              onChangeText={(v) => { setConfirm(v); setErrors((p) => ({ ...p, confirm: null })); }}
              secureTextEntry={!showConfirm}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowConfirm((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <EyeIcon open={showConfirm} />
            </TouchableOpacity>
          </View>
          {errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}
        </View>

        {errors.general && (
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>{errors.general}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.saveBtnText}>Guardar contraseña</Text>
          }
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
