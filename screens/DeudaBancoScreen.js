import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { SimInput, ResultRow, simStyles } from '../components/SimuladorComponents';
import NoloLogo from '../components/NoloLogo';

export default function DeudaBancoScreen({ navigation }) {
  const [deuda, setDeuda] = useState('5000000');
  const [rate, setRate] = useState('24');
  const [cuotas, setCuotas] = useState('24');

  const calcCuota = () => {
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(cuotas);
    const p = parseFloat(deuda);
    if (!r || !n || !p) return 0;
    return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };
  const cuota = calcCuota();
  const total = cuota * parseInt(cuotas || 0);
  const interes = total - (parseFloat(deuda) || 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💳 Deuda Banco</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Calcula el costo real de tu deuda bancaria.
        </Text>

        <SimInput label="Monto de deuda (COP)" value={deuda} onChange={setDeuda} />
        <SimInput label="Tasa EA (%)" value={rate} onChange={setRate} />
        <SimInput label="Número de cuotas" value={cuotas} onChange={setCuotas} />

        {cuota > 0 && (
          <View style={simStyles.result}>
            <ResultRow label="Cuota mensual" value={`$${cuota.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
            <ResultRow label="Total a pagar" value={`$${total.toLocaleString('es-CO')}`} color={COLORS.chartRed} />
            <ResultRow label="Total intereses" value={`$${interes.toLocaleString('es-CO')}`} color={COLORS.chartOrange} />
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
