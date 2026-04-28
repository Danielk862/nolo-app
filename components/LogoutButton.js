import { useState } from 'react';
import { TouchableOpacity, ActivityIndicator, Modal, View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { supabase } from '../lib/supabase';
import styles from '../styles/components/LogoutButton.styles';

const DARK_GREEN = '#1E7A3E';

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
        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <View style={modalStyles.iconCircle}>
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
            <Text style={modalStyles.title}>Cerrar sesión</Text>
            <Text style={modalStyles.message}>¿Estás seguro de que deseas cerrar sesión?</Text>
            <View style={modalStyles.buttons}>
              <TouchableOpacity
                style={modalStyles.btnCancel}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={modalStyles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.btnConfirm}
                onPress={handleConfirm}
              >
                <Text style={modalStyles.btnConfirmText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: DARK_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  btnCancelText: {
    color: '#555',
    fontSize: 15,
    fontWeight: '600',
  },
  btnConfirm: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: DARK_GREEN,
  },
  btnConfirmText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});
