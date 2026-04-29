import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreen,
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
    paddingHorizontal: SPACING.sm,
  },
  fieldBlock: {
    width: '100%',
    gap: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryGreen,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.darkGreen,
    paddingLeft: SPACING.lg,
    height: 56,
  },
  inputRowError: {
    borderColor: COLORS.red,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.darkGray,
  },
  eyeBtn: {
    paddingHorizontal: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginLeft: SPACING.lg,
  },
  rulesList: {
    width: '100%',
    paddingHorizontal: SPACING.sm,
    gap: 2,
  },
  ruleText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  ruleOk: {
    color: COLORS.darkGreen,
    fontWeight: '600',
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
  saveBtn: {
    backgroundColor: COLORS.darkGreen,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
    minWidth: 200,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
