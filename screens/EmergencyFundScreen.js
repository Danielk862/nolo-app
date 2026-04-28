import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { SimInput, ResultRow, simStyles } from '../components/SimulatorComponents';
import NoloLogo from '../components/NoloLogo';
import styles from '../styles/screens/simulator.styles';
import LogoutButton from '../components/LogoutButton';

export default function EmergencyFundScreen({ navigation }) {
  const [monthlyExpenses, setMonthlyExpenses] = useState('3000000');
  const [months, setMonths]                   = useState('6');

  const fund = Math.round((parseFloat(monthlyExpenses) || 0) * (parseInt(months) || 0));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛡️ Fondo de Emergencia</Text>
        <View style={styles.backBtn} />
        <LogoutButton navigation={navigation} color={COLORS.darkGray} size={26} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Calcula cuánto necesitas en tu fondo de emergencia.
        </Text>

        <SimInput label="Gastos mensuales (COP)" value={monthlyExpenses} onChange={setMonthlyExpenses} money />
        <SimInput label="Meses de cobertura"     value={months}          onChange={setMonths} />

        {fund > 0 && (
          <View style={simStyles.result}>
            <ResultRow label="Fondo recomendado" value={`$${fund.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
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
