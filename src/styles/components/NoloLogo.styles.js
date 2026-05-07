import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  iconCircle: {
    backgroundColor: COLORS.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dollar: {
    color: COLORS.white,
    fontWeight: '700',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 1,
  },
  logoArea: { 
    alignItems: 'center', 
    paddingVertical: SPACING.lg 
  },
  byline: {
    color: COLORS.gray,
  },
});
