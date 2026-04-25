import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { SimInput, ResultRow, simStyles } from '../components/SimuladorComponents';
import NoloLogo from '../components/NoloLogo';
import styles from '../styles/screens/simulador.styles';

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

