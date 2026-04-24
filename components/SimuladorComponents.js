import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

function formatMoney(raw) {
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return '';
  return parseInt(digits, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function SimInput({ label, value, onChange, money = false }) {
  const handleChange = (text) => {
    if (money) {
      onChange(text.replace(/[^0-9]/g, ''));
    } else {
      onChange(text);
    }
  };

  return (
    <View style={simStyles.inputGroup}>
      <Text style={simStyles.inputLabel}>{label}</Text>
      <TextInput
        style={simStyles.input}
        value={money ? formatMoney(value) : value}
        onChangeText={handleChange}
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
