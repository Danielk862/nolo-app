import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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

export function SimSelect({ label, value, onChange, options }) {
  return (
    <View style={simStyles.inputGroup}>
      <Text style={simStyles.inputLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', borderRadius: 6, borderWidth: 1.5, borderColor: COLORS.primaryGreen, overflow: 'hidden' }}>
        {options.map((opt, i) => {
          const active = opt === value;
          return (
            <TouchableOpacity
              key={opt}
              style={{
                flex: 1,
                paddingVertical: 10,
                alignItems: 'center',
                backgroundColor: active ? COLORS.primaryGreen : COLORS.offWhite,
                borderLeftWidth: i > 0 ? 1 : 0,
                borderLeftColor: COLORS.primaryGreen,
              }}
              onPress={() => onChange(opt)}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: active ? COLORS.white : COLORS.darkGray }}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
