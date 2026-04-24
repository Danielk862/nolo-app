import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';
import { SimInput, ResultRow, simStyles } from '../components/SimuladorComponents';
import NoloLogo from '../components/NoloLogo';

export default function FondoEmergenciaScreen({ navigation }) {
  const [gasto, setGasto] = useState('3000000');
  const [meses, setMeses] = useState('6');

  const fondo = Math.round((parseFloat(gasto) || 0) * (parseInt(meses) || 0));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛡️ Fondo de Emergencia</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Calcula cuánto necesitas en tu fondo de emergencia.
        </Text>

        <SimInput label="Gastos mensuales (COP)" value={gasto} onChange={setGasto} money />
        <SimInput label="Meses de cobertura" value={meses} onChange={setMeses} />

        {fondo > 0 && (
          <View style={simStyles.result}>
            <ResultRow label="Fondo recomendado" value={`$${fondo.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
            <Text style={simStyles.tip}>💡 Recomendado: 3-6 meses de gastos</Text>
          </View>
        )}   
        <View style={styles.logoArea}>
          <NoloLogo size="sm" color={COLORS.darkGray} />
        </View>
      </ScrollView>
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
  backBtn: { width: 40, alignItems: 'center' },
  backArrow: { fontSize: 32, color: COLORS.darkGreen, lineHeight: 36 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.darkGray },
  content: { padding: SPACING.md, gap: SPACING.md },
  description: { fontSize: 14, color: COLORS.gray, marginBottom: SPACING.xs },
});
