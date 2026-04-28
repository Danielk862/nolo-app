import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import LogoutButton from '../components/LogoutButton';
import styles from '../styles/screens/FinancesScreen.styles';
import { ROUTES } from '../constants/routes';

const MODULE_CARDS = [
  {
    id: 'personal',
    emoji: '💰',
    label: 'Finanzas Personales',
    route: ROUTES.PERSONAL_FINANCES,
    bg: '#E8F8D0',
    accent: COLORS.darkGreen,
  },
  {
    id: 'couple',
    emoji: '💑',
    label: 'Finanzas en pareja',
    route: ROUTES.COUPLE_FINANCES,
    bg: '#FFF0C8',
    accent: COLORS.primaryYellow,
  },
];

export default function FinancesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💰 Finanzas</Text>
        <LogoutButton navigation={navigation} color={COLORS.darkGray} size={26} />
      </View>

      <ScrollView contentContainerStyle={styles.inner}>
        {MODULE_CARDS.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, { backgroundColor: card.bg, borderColor: card.accent }]}
            onPress={() => navigation.navigate(card.route)}
            activeOpacity={0.85}
          >
            <Text style={styles.emoji}>{card.emoji}</Text>
            <Text style={[styles.label, { color: card.accent }]}>{card.label}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.logoContainer}>
          <NoloLogo size="md" color={COLORS.darkGray} />
          <Text style={styles.byline}>by la Peliroja Financiera</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: COLORS.darkGreen }]}
          onPress={() => navigation.navigate(ROUTES.SIMULATORS)}
        >
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: COLORS.darkGreen }]}
          onPress={() => navigation.navigate(ROUTES.SIMULATORS)}
        >
          <Text style={styles.navText}>Cursos y libros</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
