import { TouchableOpacity, View, Text } from 'react-native';
import { COLORS } from '../constants/theme';

export default function Checkbox({
  value = false,
  onChange,
  label,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onChange(!value)}
      activeOpacity={0.8}
      style={{ flexDirection: 'row', alignItems: 'center', opacity: disabled ? 0.5 : 1 }}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderWidth: 2,
          borderColor: COLORS.primaryGreen,
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 8,
          backgroundColor: value ? COLORS.darkGreen : 'transparent',
        }}
      >
        {value && (
          <Text style={{ color: 'white', fontSize: 14 }}>✓</Text>
        )}
      </View>

      {label && (
        <Text style={{ color: COLORS.darkGray }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}