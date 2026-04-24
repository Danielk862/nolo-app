import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Animated,
  Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import { supabase } from '../lib/supabase';

function EyeIcon({ open, size = 20, color = COLORS.darkGray }) {
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

export default function LoginScreen({ navigation, route }) {
  const registered = route?.params?.registered ?? false;

  const [username, setUsername]     = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);

  // Limpiar formulario cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      setUsername('');
      setPassword('');
      setShowPass(false);
      setErrors({});
    }, [])
  );

  // Toast animation
  const toastOpacity  = useRef(new Animated.Value(0)).current;
  const toastTranslateY = useRef(new Animated.Value(-16)).current;

  useEffect(() => {
    if (!registered) return;
    Animated.parallel([
      Animated.timing(toastOpacity,    { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.timing(toastTranslateY, { toValue: 0, duration: 350, useNativeDriver: true }),
    ]).start();

    const hide = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity,    { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(toastTranslateY, { toValue: -16, duration: 350, useNativeDriver: true }),
      ]).start();
    }, 3000);

    return () => clearTimeout(hide);
  }, [registered]);

  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: null }));

  // Auto-limpiar mensaje general después de 3 segundos
  useEffect(() => {
    if (!errors.general) return;
    const timer = setTimeout(() => setErrors((prev) => ({ ...prev, general: null })), 3000);
    return () => clearTimeout(timer);
  }, [errors.general]);

  const validate = () => {
    const e = {};
    if (!username.trim()) e.username = 'El usuario es requerido';
    if (!password)        e.password = 'La contraseña es requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const { data: email, error: rpcError } = await supabase
        .rpc('get_email_by_username', { p_username: username.trim().toLowerCase() });

      if (rpcError) {
        const m = rpcError.message.toLowerCase();
        if (m.includes('does not exist')) {
          setErrors({ general: 'Falta ejecutar el SQL de la función "get_email_by_username" en Supabase.' });
        } else if (m.includes('permission denied')) {
          setErrors({ general: 'Sin permisos en la base de datos. Revisa la configuración de Supabase.' });
        } else {
          setErrors({ general: `Error RPC: ${rpcError.message}` });
        }
        return;
      }
      if (!email) {
        setErrors({ general: 'Usuario o contraseña incorrectos' });
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        const msg = authError.message.toLowerCase();
        if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
          setErrors({ general: 'Usuario o contraseña incorrectos' });
        } else if (msg.includes('email not confirmed')) {
          setErrors({ general: 'Desactiva "Confirm email" en Supabase → Authentication → Providers → Email.' });
        } else if (msg.includes('too many requests')) {
          setErrors({ general: 'Demasiados intentos. Espera unos minutos e intenta de nuevo.' });
        } else {
          setErrors({ general: `Error auth: ${authError.message}` });
        }
        return;
      }

      navigation.replace('Welcome');
    } catch (err) {
      setErrors({ general: `Error de conexión: ${err?.message ?? 'desconocido'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Toast popup - cuenta creada */}
      <Animated.View
        style={[styles.toast, { opacity: toastOpacity, transform: [{ translateY: toastTranslateY }] }]}
        pointerEvents="none"
      >
        <Text style={styles.toastText}>✓  ¡Cuenta creada! Ya puedes iniciar sesión.</Text>
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👩‍🦰</Text>
          </View>
        </View>

        {/* Username */}
        <View style={styles.fieldBlock}>
          <View style={[styles.inputRow, errors.username && styles.inputRowError]}>
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor={COLORS.gray}
              value={username}
              onChangeText={(v) => { setUsername(v); clearError('username'); }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.arrowBtn} onPress={handleLogin}>
              <Text style={styles.arrowText}>»</Text>
            </TouchableOpacity>
          </View>
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
        </View>

        {/* Password */}
        <View style={styles.fieldBlock}>
          <View style={[styles.inputRow, errors.password && styles.inputRowError]}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={COLORS.gray}
              value={password}
              onChangeText={(v) => { setPassword(v); clearError('password'); }}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPass((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <EyeIcon open={showPass} color={COLORS.darkGreen} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrowBtn} onPress={handleLogin}>
              <Text style={styles.arrowText}>»</Text>
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        {errors.general && (
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>{errors.general}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.loginBtnText}>Acceder</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>
            ¿No tienes cuenta?{' '}
            <Text style={styles.registerLinkBold}>Regístrate</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <NoloLogo size="md" color={COLORS.darkGray} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreen,
  },
  toast: {
    position: 'absolute',
    top: 16,
    left: SPACING.xl,
    right: SPACING.xl,
    backgroundColor: COLORS.darkGreen,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  toastText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  avatarContainer: {
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarEmoji: {
    fontSize: 60,
  },
  fieldBlock: {
    width: '100%',
    gap: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryGreen,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.darkGreen,
    paddingLeft: SPACING.lg,
    height: 56,
  },
  inputRowError: {
    borderColor: COLORS.red,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkGray,
  },
  eyeBtn: {
    paddingHorizontal: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  arrowText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    marginTop: -2,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginLeft: SPACING.lg,
  },
  alertBox: {
    width: '100%',
    backgroundColor: '#FDE8E8',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.red,
  },
  alertText: {
    color: COLORS.red,
    fontSize: 13,
  },
  loginBtn: {
    backgroundColor: COLORS.darkGreen,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
    minWidth: 160,
    alignItems: 'center',
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    color: COLORS.darkGray,
    fontSize: 14,
  },
  registerLinkBold: {
    fontWeight: '700',
    color: COLORS.darkGreen,
    textDecorationLine: 'underline',
  },
  logoContainer: {
    marginTop: SPACING.xl,
  },
});
