import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { SimInput, ResultRow, simStyles } from '../components/SimuladorComponents';
import NoloLogo from '../components/NoloLogo';

export default function CDTScreen({ navigation }) {
  const [capital, setCapital] = useState('10000000');
  const [rate, setRate] = useState('12');
  const [months, setMonths] = useState('12');

  const result = capital && rate && months
    ? Math.round(parseFloat(capital) * (1 + (parseFloat(rate) / 100) * (parseInt(months) / 12)))
    : 0;
  const gain = result - (parseFloat(capital) || 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🏦 CDT</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Simula el rendimiento de un Certificado de Depósito a Término.
        </Text>

        <SimInput label="Capital inicial (COP)" value={capital} onChange={setCapital} />
        <SimInput label="Tasa EA (%)" value={rate} onChange={setRate} />
        <SimInput label="Plazo (meses)" value={months} onChange={setMonths} />

        {result > 0 && (
          <View style={simStyles.result}>
            <ResultRow label="Capital final" value={`$${result.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
            <ResultRow label="Rendimiento" value={`+$${gain.toLocaleString('es-CO')}`} color={COLORS.chartGreen2} />
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
