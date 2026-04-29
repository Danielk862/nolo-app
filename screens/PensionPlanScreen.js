import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { SimInput, ResultRow, simStyles } from '../components/SimulatorComponents';
import NoloLogo from '../components/NoloLogo';
import styles from '../styles/screens/simulator.styles';
import LogoutButton from '../components/LogoutButton';

export default function PensionPlanScreen({ navigation }) {
  const [age, setAge]       = useState('30');
  const [salary, setSalary] = useState('3000000');

  const yearsRemaining = 62 - (parseInt(age) || 30);
  const annualBase     = (parseFloat(salary) || 0) * 12;
  const estimated      = Math.round(annualBase * 0.65 * Math.min(yearsRemaining / 25, 1));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>👴 Plan Pensión</Text>
        <View style={styles.backBtn} />
        <LogoutButton navigation={navigation} color={COLORS.darkGray} size={26} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Estima tu pensión futura con base en tu edad y salario actual.
        </Text>

        <SimInput label="Edad actual"              value={age}    onChange={setAge} />
        <SimInput label="Salario mensual (COP)"    value={salary} onChange={setSalary} money />

        {estimated > 0 && (
          <View style={simStyles.result}>
            <ResultRow label="Años para pensión"    value={`${Math.max(0, yearsRemaining)} años`}         color={COLORS.darkGray} />
            <ResultRow label="Pensión estimada/año" value={`$${estimated.toLocaleString('es-CO')}`}        color={COLORS.darkGreen} />
            <Text style={simStyles.tip}>⚠️ Estimación simplificada. Consulta tu fondo pensional.</Text>
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
