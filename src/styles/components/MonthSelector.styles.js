import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLS = 4;
const BUTTON_WIDTH = (SCREEN_WIDTH - 2 * SPACING.md - (COLS - 1) * SPACING.xs) / COLS;

export default StyleSheet.create({
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  monthBtn: {
    width: BUTTON_WIDTH,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
