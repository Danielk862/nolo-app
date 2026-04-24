import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import LogoutButton from '../components/LogoutButton';

const SIMULATORS = [
  { id: 'cdt',        emoji: '🏦', label: 'CDT',                 description: 'Simula el rendimiento de un CDT',              route: 'SimuladorCDT' },
  { id: 'deuda',      emoji: '💳', label: 'Deuda Banco',          description: 'Calcula el costo real de tu deuda bancaria',    route: 'SimuladorDeuda' },
  { id: 'emergencia', emoji: '🛡️', label: 'Fondo de Emergencia',  description: 'Calcula cuánto necesitas en tu fondo',          route: 'SimuladorEmergencia' },
  { id: 'ahorro',     emoji: '🐷', label: 'Ahorro',               description: 'Proyecta el crecimiento de tus ahorros',        route: 'SimuladorAhorro' },
  { id: 'pension',    emoji: '👴', label: 'Plan Pensión',          description: 'Estima tu pensión futura',                     route: 'SimuladorPension' },
  { id: 'prestamos',  emoji: '📋', label: 'Préstamos',             description: 'Calcula cuotas y total a pagar',               route: 'SimuladorPrestamos' },
];

export default function SimuladoresScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <NoloLogo size="md" color={COLORS.darkGreen} />
        <Text style={styles.simMenu}>
          Menú
        </Text>
        <LogoutButton navigation={navigation} color={COLORS.darkGray} size={24} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.simCard}
          onPress={() => navigation.navigate('Home')}
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
          onPress={() => navigation.navigate('Simuladores')}
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

const styles = StyleSheet.create({
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
  logoArea: { alignItems: 'center', paddingVertical: SPACING.lg },
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
