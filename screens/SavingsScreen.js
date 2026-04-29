import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { SimInput, ResultRow, simStyles } from '../components/SimulatorComponents';
import NoloLogo from '../components/NoloLogo';
import styles from '../styles/screens/simulator.styles';
import LogoutButton from '../components/LogoutButton';

export default function SavingsScreen({ navigation }) {
  const [savings, setSavings] = useState('500000');
  const [rate, setRate]       = useState('8');
  const [years, setYears]     = useState('5');

  const calcFuture = () => {
    const r   = parseFloat(rate) / 100 / 12;
    const n   = parseInt(years) * 12;
    const pmt = parseFloat(savings);
    if (!r || !n || !pmt) return 0;
    return Math.round(pmt * ((Math.pow(1 + r, n) - 1) / r));
  };
  const future   = calcFuture();
  const invested = (parseFloat(savings) || 0) * (parseInt(years) || 0) * 12;
  const earnings = future - invested;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🐷 Ahorro</Text>
        <View style={styles.backBtn} />
        <LogoutButton navigation={navigation} color={COLORS.darkGray} size={26} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Proyecta el crecimiento de tus ahorros en el tiempo.
        </Text>

        <SimInput label="Ahorro mensual (COP)" value={savings} onChange={setSavings} money />
        <SimInput label="Tasa anual (%)"       value={rate}    onChange={setRate} />
        <SimInput label="Años de ahorro"       value={years}   onChange={setYears} />

        {future > 0 && (
          <View style={simStyles.result}>
            <ResultRow label="Valor futuro"    value={`$${future.toLocaleString('es-CO')}`}   color={COLORS.darkGreen} />
            <ResultRow label="Total invertido" value={`$${invested.toLocaleString('es-CO')}`} color={COLORS.gray} />
            <ResultRow label="Rendimiento"     value={`+$${earnings.toLocaleString('es-CO')}`} color={COLORS.chartGreen2} />
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
