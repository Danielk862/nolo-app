import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { SimInput, ResultRow, simStyles } from '../components/SimuladorComponents';
import NoloLogo from '../components/NoloLogo';

export default function PlanPensionScreen({ navigation }) {
  const [edad, setEdad] = useState('30');
  const [salario, setSalario] = useState('3000000');

  const anosFaltantes = 62 - (parseInt(edad) || 30);
  const baseAnual = (parseFloat(salario) || 0) * 12;
  const estimado = Math.round(baseAnual * 0.65 * Math.min(anosFaltantes / 25, 1));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>👴 Plan Pensión</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Estima tu pensión futura con base en tu edad y salario actual.
        </Text>

        <SimInput label="Edad actual" value={edad} onChange={setEdad} />
        <SimInput label="Salario mensual (COP)" value={salario} onChange={setSalario} />

        {estimado > 0 && (
          <View style={simStyles.result}>
            <ResultRow label="Años para pensión" value={`${Math.max(0, anosFaltantes)} años`} color={COLORS.darkGray} />
            <ResultRow label="Pensión estimada/año" value={`$${estimado.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
            <Text style={simStyles.tip}>⚠️ Estimación simplificada. Consulta tu fondo pensional.</Text>
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
