import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { SimInput, ResultRow, simStyles } from '../components/SimulatorComponents';
import NoloLogo from '../components/NoloLogo';
import styles from '../styles/screens/simulator.styles';
import LogoutButton from '../components/LogoutButton';

export default function LoansScreen({ navigation }) {
  const [amount, setAmount]           = useState('10000000');
  const [rate, setRate]               = useState('18');
  const [installments, setInstallments] = useState('36');

  const calcInstallment = () => {
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(installments);
    const p = parseFloat(amount);
    if (!r || !n || !p) return 0;
    return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };
  const installment = calcInstallment();
  const total    = installment * parseInt(installments || 0);
  const interest = total - (parseFloat(amount) || 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📋 Préstamos</Text>
        <View style={styles.backBtn} />
        <LogoutButton navigation={navigation} color={COLORS.darkGray} size={26} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Calcula cuotas y el total a pagar en un préstamo.
        </Text>

        <SimInput label="Monto del préstamo (COP)" value={amount}       onChange={setAmount} money />
        <SimInput label="Tasa EA (%)"              value={rate}         onChange={setRate} />
        <SimInput label="Número de cuotas"         value={installments} onChange={setInstallments} />

        {installment > 0 && (
          <View style={simStyles.result}>
            <ResultRow label="Cuota mensual"   value={`$${installment.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
            <ResultRow label="Total a pagar"   value={`$${total.toLocaleString('es-CO')}`}       color={COLORS.chartRed} />
            <ResultRow label="Total intereses" value={`$${interest.toLocaleString('es-CO')}`}    color={COLORS.chartOrange} />
          </View>
        )}
        <View style={styles.logoArea}>
          <NoloLogo size="sm" color={COLORS.darkGray} />
          <Text style={styles.byline}>by la Peliroja Financiera</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
