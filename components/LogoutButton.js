import { useState } from 'react';
import { TouchableOpacity, ActivityIndicator, Modal, View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { supabase } from '../lib/supabase';
import styles from '../styles/components/LogoutButton.styles';

export default function LogoutButton({ navigation, color = '#555555', size = 24, style }) {
  const [loading, setLoading]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = async () => {
    setShowConfirm(false);
    setLoading(true);
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowConfirm(true)}
        disabled={loading}
        style={[styles.btn, style]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
              stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            />
            <Path
              d="M16 17l5-5-5-5"
              stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            />
            <Path
              d="M21 12H9"
              stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            />
          </Svg>
        )}
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={showConfirm}
        onRequestClose={() => setShowConfirm(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                  stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                />
                <Path
                  d="M16 17l5-5-5-5"
                  stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                />
                <Path
                  d="M21 12H9"
                  stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.title}>Cerrar sesión</Text>
            <Text style={styles.message}>¿Estás seguro de que deseas cerrar sesión?</Text>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnConfirm}
                onPress={handleConfirm}
              >
                <Text style={styles.btnConfirmText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
