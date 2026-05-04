import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

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
  backBtn: { width: 40, alignItems: 'center' },
  backArrow: { fontSize: 32, color: COLORS.darkGreen, lineHeight: 36 },
  byline: {
    color: COLORS.gray,
    fontSize: 14,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.darkGray },
  content: { padding: SPACING.md, gap: SPACING.md },
  description: { fontSize: 14, color: COLORS.gray, marginBottom: SPACING.xs },
  logoArea: { alignItems: 'center', paddingVertical: SPACING.lg },
  youtubeCard: {
    width: 310,
    height: 110,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  spotifyCard: {
    width: 310,
    height: 110,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  applePodcastCard: {
    width: 310,
    height: 110,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  ytInner: {
    justifyContent: "center",
    alignItems: "center",
  },
  ytIcon: {
    width: 900,
    height: 200,
    marginBottom: 8,
  },
  ytLabel: {
    fontSize: 6,
    fontWeight: "600",
    textAlign: "center",
  },
});
