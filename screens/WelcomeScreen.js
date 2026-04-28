import {
  View, Text, TouchableOpacity, Linking,
} from 'react-native';
import { ROUTES } from '../constants/routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import LogoutButton from '../components/LogoutButton';
import styles from '../styles/screens/WelcomeScreen.styles';

export default function WelcomeScreen({ navigation }) {
  const handleTutorial = () => {
    Linking.openURL('https://www.youtube.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <LogoutButton navigation={navigation} color={COLORS.darkGray} size={26} />
      </View>
      <View style={styles.inner}>
        <Text style={styles.welcome}>Bienvenid@ a</Text>

        <NoloLogo size="lg" color={COLORS.darkGray} />

        <TouchableOpacity style={styles.youtubeCard} onPress={handleTutorial}>
          <View style={styles.ytInner}>
            <View style={styles.ytPlay}>
              <Text style={styles.ytPlayText}>▶</Text>
            </View>
            <Text style={styles.ytLabel}>YouTube</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleTutorial}>
          <Text style={styles.tutorialLink}>ver tutorial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => navigation.replace(ROUTES.SIMULATORS)}
        >
          <Text style={styles.continueBtnText}>Continuar →</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

