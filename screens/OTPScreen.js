import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { ROUTES } from '../constants/routes';
import styles from '../styles/screens/OTPScreen.styles';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function OTPScreen({ navigation, route }) {
  const { email } = route.params;

  const [code, setCode]           = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const inputRef                  = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChangeText = (text) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    setCode(digits);
    setError('');
  };

  const handleVerify = async () => {
    if (code.length < OTP_LENGTH) {
      setError('Ingresa los 6 dígitos del código');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    setError('');
    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      });
      if (verifyError) {
        setError('Código incorrecto o expirado. Revisa tu correo e intenta de nuevo.');
        setCode('');
        setTimeout(() => inputRef.current?.focus(), 100);
        return;
      }
      navigation.replace(ROUTES.CHANGE_PASSWORD);
    } catch (e) {
      setError(e?.message || 'Error al verificar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError('');
    setCode('');
    setCountdown(RESEND_COOLDOWN);
    try {
      await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });
    } catch {
      // silent — user notará si no llega
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) =>
    a + '*'.repeat(Math.min(b.length, 4)) + c
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <View style={styles.inner}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>📬</Text>
        </View>

        <Text style={styles.title}>Revisa tu correo</Text>
        <Text style={styles.subtitle}>
          Enviamos un código de 6 dígitos a{'\n'}
          <Text style={styles.emailHighlight}>{maskedEmail}</Text>
        </Text>

        {/* Cajas visuales — tocar cualquiera abre el teclado */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => inputRef.current?.focus()}
          style={styles.boxesRow}
        >
          {Array(OTP_LENGTH).fill(0).map((_, i) => (
            <View
              key={i}
              style={[
                styles.otpBox,
                i === code.length && styles.otpBoxFocused,
                i < code.length && styles.otpBoxFilled,
              ]}
            >
              <Text style={styles.otpDigit}>{code[i] ?? ''}</Text>
            </View>
          ))}
        </TouchableOpacity>

        {/* TextInput real oculto que captura la entrada */}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={handleChangeText}
          keyboardType="numeric"
          maxLength={OTP_LENGTH}
          style={styles.hiddenInput}
          caretHidden
          autoFocus
        />

        {!!error && (
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.verifyBtn, loading && styles.verifyBtnDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.verifyBtnText}>Verificar código</Text>
          }
        </TouchableOpacity>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>¿No llegó el correo?</Text>
          <TouchableOpacity onPress={handleResend} disabled={countdown > 0}>
            <Text style={[styles.resendLink, countdown > 0 && styles.resendDisabled]}>
              {countdown > 0 ? `Reenviar en ${countdown}s` : 'Reenviar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
