import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreen,
  },
  topBar: {
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  welcome: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.darkGray,
    textAlign: 'center',
    letterSpacing: 1,
  },
  youtubeCard: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  ytInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  ytPlay: {
    width: 44,
    height: 36,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ytPlayText: {
    color: COLORS.white,
    fontSize: 18,
    marginLeft: 2,
  },
  ytLabel: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '600',
  },
  tutorialLink: {
    color: COLORS.darkGray,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  continueBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.darkGreen,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.full,
  },
  continueBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
