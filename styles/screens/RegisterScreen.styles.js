import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

export const dropStyles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightGray,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primaryGreen,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  btnError: { borderColor: COLORS.red },
  btnText: { fontSize: 15, color: COLORS.darkGray, flex: 1 },
  placeholder: { color: COLORS.gray },
  arrow: { fontSize: 16, color: COLORS.darkGray, marginLeft: SPACING.xs },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    width: '100%',
    overflow: 'hidden',
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.darkGreen,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  optionActive: { backgroundColor: '#F0FFF0' },
  optionText: { fontSize: 15, color: COLORS.darkGray },
  optionTextActive: { color: COLORS.darkGreen, fontWeight: '600' },
  check: { color: COLORS.darkGreen, fontSize: 16, fontWeight: '700' },
});

export const fieldStyles = StyleSheet.create({
  block: { gap: 4 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.darkGray, marginLeft: 4 },
  req: { color: COLORS.red },
  error: { color: COLORS.red, fontSize: 12, marginLeft: 4 },
});

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreen,
  },
  scroll: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  header: {
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.darkGray,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.darkGreen,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.lightGreen,
    paddingBottom: SPACING.xs,
  },
  sectionNote: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: -SPACING.sm,
  },
  row2: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primaryGreen,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  inputRowError: {
    borderColor: COLORS.red,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.darkGray,
  },
  alertBox: {
    backgroundColor: '#FDE8E8',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.red,
  },
  alertBoxSuccess: {
    backgroundColor: '#E8F5E9',
    borderLeftColor: COLORS.darkGreen,
  },
  alertText: {
    color: COLORS.red,
    fontSize: 13,
    lineHeight: 20,
  },
  alertTextSuccess: {
    color: COLORS.darkGreen,
  },
  registerBtn: {
    backgroundColor: COLORS.darkGreen,
    paddingVertical: 16,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  registerBtnDisabled: {
    opacity: 0.7,
  },
  registerBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  loginLinkText: {
    color: COLORS.darkGray,
    fontSize: 14,
  },
  loginLinkBold: {
    fontWeight: '700',
    color: COLORS.darkGreen,
    textDecorationLine: 'underline',
  },
});
