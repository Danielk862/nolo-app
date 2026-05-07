import { fieldStyles } from '../styles/components/Field.styles';
import { View, Text,  } from 'react-native';

export function Field({ label, required, error, children }) {
  return (
    <View style={fieldStyles.block}>
    <Text style={fieldStyles.label}>
      {label}
      {required && <Text style={fieldStyles.req}> *</Text>}
    </Text>
    {children}
    {error && <Text style={fieldStyles.error}>{error}</Text>}
    </View>
  );
}
