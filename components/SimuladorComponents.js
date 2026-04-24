import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export function SimInput({ label, value, onChange }) {
  return (
    <View style={simStyles.inputGroup}>
      <Text style={simStyles.inputLabel}>{label}</Text>
      <TextInput
        style={simStyles.input}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor={COLORS.gray}
      />
    </View>
  );
}

export function ResultRow({ label, value, color }) {
  return (
    <View style={simStyles.resultRow}>
      <Text style={simStyles.resultLabel}>{label}</Text>
      <Text style={[simStyles.resultValue, { color }]}>{value}</Text>
    </View>
  );
}

export const simStyles = StyleSheet.create({
  inputGroup: { gap: 4 },
  inputLabel: { fontSize: 12, color: COLORS.gray, fontWeight: '500' },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.primaryGreen,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    fontSize: 16,
    color: COLORS.darkGray,
    backgroundColor: COLORS.offWhite,
  },
  result: {
    backgroundColor: '#F0FFF0',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryGreen,
    gap: SPACING.xs,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: { fontSize: 14, color: COLORS.darkGray },
  resultValue: { fontSize: 15, fontWeight: '700' },
  tip: { fontSize: 12, color: COLORS.gray, fontStyle: 'italic', marginTop: 4 },
});
