import { View, Text, TextInput } from 'react-native';
import { COLORS } from '../constants/theme';
import simStyles from '../styles/components/SimulatorComponents.styles';
import { formatMoney } from '../utils/formatMoney';

export { simStyles };

export function SimInput({ label, value, onChange, onBlur, onEndEditing, money = false }) {
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
        onBlur={onBlur}
        onEndEditing={onEndEditing}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor={COLORS.gray}
      />
    </View>
  );
}

export function SimInputDecimal({ label, value, onChange, decimal = false }) {
  const handleChangeDecimal = (text) => {
    if (!decimal) {
      onChange(text);
      return;
    }

    let clean = text.replace(/[^0-9.]/g, '');

    const parts = clean.split('.');
    if (parts.length > 2) {
      clean = parts[0] + '.' + parts.slice(1).join('');
    }

    if (clean.includes('.')) {
      const [int, dec] = clean.split('.');
      clean = int + '.' + dec.slice(0, 2);
    }

    onChange(clean);
  };

  return (
    <View style={simStyles.inputGroup}>
      <Text style={simStyles.inputLabel}>{label}</Text>
      <TextInput
        style={simStyles.input}
        value={value || ''}
        onChangeText={handleChangeDecimal}
        keyboardType="decimal-pad"
        placeholder="0.00"
        placeholderTextColor={COLORS.gray}
      />
    </View>
  );
}

export function ResultRow({ label, value, color, total = false }) {
  return (
    <View style={simStyles.resultRow}>
      <Text style={total ? simStyles.total : simStyles.resultLabel}>{label}</Text>
      <Text style={[total ? simStyles.total : simStyles.resultValue, { color }]}>{value}</Text>
    </View>
  );
}
