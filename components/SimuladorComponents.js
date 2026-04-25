import { View, Text, TextInput } from 'react-native';
import { COLORS } from '../constants/theme';
import simStyles from '../styles/components/SimuladorComponents.styles';

export { simStyles };

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

