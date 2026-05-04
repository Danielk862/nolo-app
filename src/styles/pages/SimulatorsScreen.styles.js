import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  scroll: { flex: 1 },
  scrollContent: { padding: SPACING.md, gap: SPACING.md },
  simCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGreen,
  },
  simMenu: { fontSize: 30, fontWeight: '700', color: COLORS.darkGray },
  simEmoji: { fontSize: 32 },
  simInfo: { flex: 1, gap: 2 },
  simLabel: { fontSize: 16, fontWeight: '700', color: COLORS.darkGray },
  simDesc: { fontSize: 12, color: COLORS.gray },
  arrow: { fontSize: 22, color: COLORS.darkGreen, fontWeight: '700' },
  bottomNav: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  navText: { color: COLORS.white, fontWeight: '600', fontSize: 12 },
});
