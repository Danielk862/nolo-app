import {
  View, Text, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import LogoutButton from '../components/LogoutButton';
import styles from '../styles/screens/SimulatorsScreen.styles';
import { ROUTES } from '../constants/routes';

const SIMULATORS = [
  { id: 'cdt',       emoji: '🏦', label: 'CDT',                description: 'Simula el rendimiento de un CDT',           route: ROUTES.SIMULATOR_CDT },
  { id: 'debt',      emoji: '💳', label: 'Deuda Banco',         description: 'Calcula el costo real de tu deuda bancaria', route: ROUTES.SIMULATOR_DEBT },
  { id: 'emergency', emoji: '🛡️', label: 'Fondo de Emergencia', description: 'Calcula cuánto necesitas en tu fondo',       route: ROUTES.SIMULATOR_EMERGENCY },
  { id: 'savings',   emoji: '🐷', label: 'Ahorro',              description: 'Proyecta el crecimiento de tus ahorros',     route: ROUTES.SIMULATOR_SAVINGS },
  { id: 'pension',   emoji: '👴', label: 'Plan Pensión',         description: 'Estima tu pensión futura',                  route: ROUTES.SIMULATOR_PENSION },
  { id: 'loans',     emoji: '📋', label: 'Préstamos',            description: 'Calcula cuotas y total a pagar',            route: ROUTES.SIMULATOR_LOANS },
];

export default function SimulatorsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <NoloLogo size="md" color={COLORS.darkGreen} />
        <Text style={styles.simMenu}>Menú</Text>
        <LogoutButton navigation={navigation} color={COLORS.darkGray} size={24} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.simCard}
          onPress={() => navigation.navigate(ROUTES.FINANCES)}
        >
          <Text style={styles.simEmoji}>💰</Text>
          <View style={styles.simInfo}>
            <Text style={styles.simLabel}>Finanzas</Text>
            <Text style={styles.simDesc}>Ver Finanzas Personales y en Pareja</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {SIMULATORS.map(sim => (
          <TouchableOpacity
            key={sim.id}
            style={styles.simCard}
            onPress={() => navigation.navigate(sim.route)}
          >
            <Text style={styles.simEmoji}>{sim.emoji}</Text>
            <View style={styles.simInfo}>
              <Text style={styles.simLabel}>{sim.label}</Text>
              <Text style={styles.simDesc}>{sim.description}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: COLORS.darkGreen }]}
          onPress={() => navigation.navigate(ROUTES.SIMULATORS)}
        >
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, { backgroundColor: COLORS.darkGreen }]}>
          <Text style={styles.navText}>Cursos y libros</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
