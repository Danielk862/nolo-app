import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

const localStyles = StyleSheet.create({
  backBtn: { width: 40, alignItems: 'center' },
  backArrow: { fontSize: 32, color: COLORS.darkGreen, lineHeight: 36 },
});

export default function FinanceHeader({ emoji, title, navigation, styles }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={localStyles.backBtn}>
        <Text style={localStyles.backArrow}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.headerEmoji}>{emoji}</Text>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}
