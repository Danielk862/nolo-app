import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Animated,
  Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import { supabase } from '../lib/supabase';
import styles from '../styles/screens/LoginScreen.styles';

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

