import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  backBtn: {
    width: 40,
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 32,
    color: COLORS.darkGreen,
    lineHeight: 36,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  iconEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.darkGreen,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  emailHighlight: {
    fontWeight: '700',
    color: COLORS.darkGreen,
  },
  boxesRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  otpBox: {
    width: 44,
    height: 56,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.darkGreen,
    backgroundColor: COLORS.primaryGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFocused: {
    borderColor: COLORS.darkGreen,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.darkGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  otpBoxFilled: {
    backgroundColor: COLORS.white,
  },
  otpDigit: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.darkGreen,
  },
  alertBox: {
    width: '100%',
    backgroundColor: '#FDE8E8',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.red,
  },
  alertText: {
    color: COLORS.red,
    fontSize: 13,
  },
  verifyBtn: {
    backgroundColor: COLORS.darkGreen,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
    minWidth: 200,
    alignItems: 'center',
  },
  verifyBtnDisabled: {
    opacity: 0.7,
  },
  verifyBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  resendRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  resendText: {
    fontSize: 13,
    color: COLORS.darkGray,
  },
  resendLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkGreen,
    textDecorationLine: 'underline',
  },
  resendDisabled: {
    color: COLORS.gray,
    textDecorationLine: 'none',
  },
  timerText: {
    fontSize: 13,
    color: COLORS.gray,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
