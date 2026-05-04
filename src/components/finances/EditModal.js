import { View, Text, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { formatMoney } from '../../utils/formatMoney';
import { COLORS } from '../../constants/theme';

export default function EditModal({
  visible,
  editCategory,
  editValue,
  setEditValue,
  onSave,
  onCancel,
  accentColor,
  styles,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {editCategory?.emoji} {editCategory?.label}
          </Text>
          <Text style={styles.modalSubtitle}>
            {editCategory?.type === 'income' ? 'Ingreso (COP)' : 'Gasto (COP)'}
          </Text>
          <TextInput
            style={[styles.modalInput, accentColor && { borderColor: accentColor }]}
            value={formatMoney(editValue)}
            onChangeText={(text) => setEditValue(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            placeholder="0"
            autoFocus
          />
          <View style={styles.modalBtns}>
            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: COLORS.lightGray }]}
              onPress={onCancel}
            >
              <Text style={styles.modalBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, accentColor && { backgroundColor: accentColor }]}
              onPress={onSave}
            >
              <Text style={[styles.modalBtnText, { color: COLORS.white }]}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
