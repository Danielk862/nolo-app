import { Modal, View, ActivityIndicator, Text } from 'react-native';
import { useLoader } from '../context/LoadingContext';
import styles from '../styles/components/FullScreenLoader.styles';

export default function FullScreenLoader() {
  const { visible, message } = useLoader();

  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#1E7A3E" />
          {!!message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
}
