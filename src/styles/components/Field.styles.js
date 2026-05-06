import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const fieldStyles = StyleSheet.create({
  block: { gap: 4 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.gray, marginLeft: 4 },
  req: { color: COLORS.red },
  error: { color: COLORS.red, fontSize: 12, marginLeft: 4 },
});