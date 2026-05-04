import { View, Text, TextInput } from 'react-native';
import { COLORS } from '../constants/theme';
import simStyles from '../styles/components/SimuladorComponents.styles';
import { formatMoney } from '../utils/formatMoney';

export { simStyles };

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

