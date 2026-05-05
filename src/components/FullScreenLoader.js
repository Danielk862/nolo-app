import { Modal, View, ActivityIndicator, Text, Image } from 'react-native';
import { useLoader } from '../context/LoadingContext';
import styles from '../styles/components/FullScreenLoader.styles';

export default function FullScreenLoader() {
  const { visible, message } = useLoader();

  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image
            source={require('../../assets/images/LoadingCircle.gif')}
            style={{ width: 200, height: 200 }}
            resizeMode='contain'
          />
           {!!message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
}
