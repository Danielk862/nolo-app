import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';
import { SimInput, ResultRow, simStyles } from '../components/SimuladorComponents';
import NoloLogo from '../components/NoloLogo';

export default function AhorroScreen({ navigation }) {
  const [ahorro, setAhorro] = useState('500000');
  const [rate, setRate] = useState('8');
  const [anos, setAnos] = useState('5');

  const calcFuturo = () => {
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(anos) * 12;
    const pmt = parseFloat(ahorro);
    if (!r || !n || !pmt) return 0;
    return Math.round(pmt * ((Math.pow(1 + r, n) - 1) / r));
  };
  const futuro = calcFuturo();
  const invertido = (parseFloat(ahorro) || 0) * (parseInt(anos) || 0) * 12;
  const ganancia = futuro - invertido;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🐷 Ahorro</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Proyecta el crecimiento de tus ahorros en el tiempo.
        </Text>

        <SimInput label="Ahorro mensual (COP)" value={ahorro} onChange={setAhorro} money />
        <SimInput label="Tasa anual (%)" value={rate} onChange={setRate} />
        <SimInput label="Años de ahorro" value={anos} onChange={setAnos} />

        {futuro > 0 && (
          <View style={simStyles.result}>
            <ResultRow label="Valor futuro" value={`$${futuro.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
            <ResultRow label="Total invertido" value={`$${invertido.toLocaleString('es-CO')}`} color={COLORS.gray} />
            <ResultRow label="Rendimiento" value={`+$${ganancia.toLocaleString('es-CO')}`} color={COLORS.chartGreen2} />
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
