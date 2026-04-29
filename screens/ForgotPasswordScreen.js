import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { ROUTES } from '../constants/routes';
import styles from '../styles/screens/ForgotPasswordScreen.styles';

export default function ForgotPasswordScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSend = async () => {
    const trimmed = username.trim().toLowerCase();
    if (!trimmed) {
      setError('Ingresa tu nombre de usuario');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data: email, error: rpcError } = await supabase
        .rpc('get_email_by_username', { p_username: trimmed });

      if (rpcError) throw rpcError;
      if (!email) {
        setError('No encontramos una cuenta con ese usuario');
        return;
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });

      if (otpError) throw otpError;

      navigation.navigate(ROUTES.OTP_VERIFY, { email });
    } catch (e) {
      setError(e?.message || 'Error al enviar el código. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>🔑</Text>
        </View>

        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
        <Text style={styles.subtitle}>
          Ingresa tu usuario y enviaremos un código de verificación a tu correo electrónico registrado.
        </Text>

        <View style={styles.fieldBlock}>
          <View style={[styles.inputRow, error && styles.inputRowError]}>
            <TextInput
              style={styles.input}
              placeholder="Usuario"
              placeholderTextColor="#AAAAAA"
              value={username}
              onChangeText={(v) => { setUsername(v); setError(''); }}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
          </View>
          {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <TouchableOpacity
          style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.sendBtnText}>Enviar código</Text>
          }
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
