import { View, Text } from 'react-native';
import LogoutButton from '../LogoutButton';

export default function FinanceHeader({ emoji, title, navigation, color, styles }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerEmoji}>{emoji}</Text>
      <Text style={styles.headerTitle}>{title}</Text>
      <LogoutButton navigation={navigation} color={color} size={24} />
    </View>
  );
}
