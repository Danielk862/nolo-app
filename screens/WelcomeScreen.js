import { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Linking, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import { supabase } from '../lib/supabase';

export default function WelcomeScreen({ navigation }) {
  const [signingOut, setSigningOut] = useState(false);

  const handleTutorial = () => {
    Linking.openURL('https://www.youtube.com');
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
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
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.continueBtnText}>Continuar →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
          disabled={signingOut}
        >
          {signingOut
            ? <ActivityIndicator size="small" color={COLORS.darkGray} />
            : <Text style={styles.signOutText}>← Cerrar sesión</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreen,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  welcome: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.darkGray,
    textAlign: 'center',
    letterSpacing: 1,
  },
  youtubeCard: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  ytInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  ytPlay: {
    width: 44,
    height: 36,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ytPlayText: {
    color: COLORS.white,
    fontSize: 18,
    marginLeft: 2,
  },
  ytLabel: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '600',
  },
  tutorialLink: {
    color: COLORS.darkGray,
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  continueBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.darkGreen,
    paddingVertical: 14,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.full,
  },
  continueBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  signOutBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    color: COLORS.darkGray,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
