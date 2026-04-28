import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

export default StyleSheet.create({
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
