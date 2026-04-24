import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import LogoutButton from '../components/LogoutButton';

const SIMULATORS = [
  { id: 'cdt', label: 'CDT', emoji: '🏦', description: 'Simula el rendimiento de un Certificado de Depósito a Término' },
  { id: 'deuda', label: 'Deuda Banco', emoji: '💳', description: 'Calcula el costo real de tu deuda bancaria' },
  { id: 'emergencia', label: 'Fondo de Emergencia', emoji: '🛡️', description: 'Calcula cuánto necesitas en tu fondo de emergencia' },
  { id: 'ahorro', label: 'Ahorro', emoji: '🐷', description: 'Proyecta el crecimiento de tus ahorros' },
  { id: 'pension', label: 'Plan Pensión', emoji: '👴', description: 'Estima tu pensión futura' },
  { id: 'prestamos', label: 'Préstamos', emoji: '📋', description: 'Calcula cuotas y total a pagar en un préstamo' },
];

function CDTSimulator() {
  const [capital, setCapital] = useState('10000000');
  const [rate, setRate] = useState('12');
  const [months, setMonths] = useState('12');
  const result = capital && rate && months
    ? Math.round(parseFloat(capital) * (1 + (parseFloat(rate) / 100) * (parseInt(months) / 12)))
    : 0;
  const gain = result - (parseFloat(capital) || 0);
  return (
    <View style={sim.container}>
      <Text style={sim.title}>🏦 Simulador CDT</Text>
      <SimInput label="Capital inicial (COP)" value={capital} onChange={setCapital} />
      <SimInput label="Tasa EA (%)" value={rate} onChange={setRate} />
      <SimInput label="Plazo (meses)" value={months} onChange={setMonths} />
      {result > 0 && (
        <View style={sim.result}>
          <ResultRow label="Capital final" value={`$${result.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
          <ResultRow label="Rendimiento" value={`+$${gain.toLocaleString('es-CO')}`} color={COLORS.chartGreen2} />
        </View>
      )}
    </View>
  );
}

function DeudaSimulator() {
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
    <View style={sim.container}>
      <Text style={sim.title}>💳 Deuda Banco</Text>
      <SimInput label="Monto de deuda (COP)" value={deuda} onChange={setDeuda} />
      <SimInput label="Tasa EA (%)" value={rate} onChange={setRate} />
      <SimInput label="Número de cuotas" value={cuotas} onChange={setCuotas} />
      {cuota > 0 && (
        <View style={sim.result}>
          <ResultRow label="Cuota mensual" value={`$${cuota.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
          <ResultRow label="Total a pagar" value={`$${total.toLocaleString('es-CO')}`} color={COLORS.chartRed} />
          <ResultRow label="Total intereses" value={`$${interes.toLocaleString('es-CO')}`} color={COLORS.chartOrange} />
        </View>
      )}
    </View>
  );
}

function EmergenciaSimulator() {
  const [gasto, setGasto] = useState('3000000');
  const [meses, setMeses] = useState('6');
  const fondo = Math.round((parseFloat(gasto) || 0) * (parseInt(meses) || 0));
  return (
    <View style={sim.container}>
      <Text style={sim.title}>🛡️ Fondo de Emergencia</Text>
      <SimInput label="Gastos mensuales (COP)" value={gasto} onChange={setGasto} />
      <SimInput label="Meses de cobertura" value={meses} onChange={setMeses} />
      {fondo > 0 && (
        <View style={sim.result}>
          <ResultRow label="Fondo recomendado" value={`$${fondo.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
          <Text style={sim.tip}>💡 Recomendado: 3-6 meses de gastos</Text>
        </View>
      )}
    </View>
  );
}

function AhorroSimulator() {
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
    <View style={sim.container}>
      <Text style={sim.title}>🐷 Simulador de Ahorro</Text>
      <SimInput label="Ahorro mensual (COP)" value={ahorro} onChange={setAhorro} />
      <SimInput label="Tasa anual (%)" value={rate} onChange={setRate} />
      <SimInput label="Años de ahorro" value={anos} onChange={setAnos} />
      {futuro > 0 && (
        <View style={sim.result}>
          <ResultRow label="Valor futuro" value={`$${futuro.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
          <ResultRow label="Total invertido" value={`$${invertido.toLocaleString('es-CO')}`} color={COLORS.gray} />
          <ResultRow label="Rendimiento" value={`+$${ganancia.toLocaleString('es-CO')}`} color={COLORS.chartGreen2} />
        </View>
      )}
    </View>
  );
}

function PensionSimulator() {
  const [edad, setEdad] = useState('30');
  const [salario, setSalario] = useState('3000000');
  const anosFaltantes = 62 - (parseInt(edad) || 30);
  const baseAnual = (parseFloat(salario) || 0) * 12;
  const estimado = Math.round(baseAnual * 0.65 * Math.min(anosFaltantes / 25, 1));
  return (
    <View style={sim.container}>
      <Text style={sim.title}>👴 Plan Pensión</Text>
      <SimInput label="Edad actual" value={edad} onChange={setEdad} />
      <SimInput label="Salario mensual (COP)" value={salario} onChange={setSalario} />
      {estimado > 0 && (
        <View style={sim.result}>
          <ResultRow label="Años para pensión" value={`${Math.max(0, anosFaltantes)} años`} color={COLORS.darkGray} />
          <ResultRow label="Pensión estimada/año" value={`$${estimado.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
          <Text style={sim.tip}>⚠️ Estimación simplificada. Consulta tu fondo pensional.</Text>
        </View>
      )}
    </View>
  );
}

function PrestamosSimulator() {
  const [monto, setMonto] = useState('10000000');
  const [rate, setRate] = useState('18');
  const [cuotas, setCuotas] = useState('36');
  const calcCuota = () => {
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(cuotas);
    const p = parseFloat(monto);
    if (!r || !n || !p) return 0;
    return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };
  const cuota = calcCuota();
  const total = cuota * parseInt(cuotas || 0);
  const interes = total - (parseFloat(monto) || 0);
  return (
    <View style={sim.container}>
      <Text style={sim.title}>📋 Préstamos</Text>
      <SimInput label="Monto del préstamo (COP)" value={monto} onChange={setMonto} />
      <SimInput label="Tasa EA (%)" value={rate} onChange={setRate} />
      <SimInput label="Número de cuotas" value={cuotas} onChange={setCuotas} />
      {cuota > 0 && (
        <View style={sim.result}>
          <ResultRow label="Cuota mensual" value={`$${cuota.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
          <ResultRow label="Total a pagar" value={`$${total.toLocaleString('es-CO')}`} color={COLORS.chartRed} />
          <ResultRow label="Total intereses" value={`$${interes.toLocaleString('es-CO')}`} color={COLORS.chartOrange} />
        </View>
      )}
    </View>
  );
}

function SimInput({ label, value, onChange }) {
  return (
    <View style={sim.inputGroup}>
      <Text style={sim.inputLabel}>{label}</Text>
      <TextInput
        style={sim.input}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor={COLORS.gray}
      />
    </View>
  );
}

function ResultRow({ label, value, color }) {
  return (
    <View style={sim.resultRow}>
      <Text style={sim.resultLabel}>{label}</Text>
      <Text style={[sim.resultValue, { color }]}>{value}</Text>
    </View>
  );
}

const sim = StyleSheet.create({
  container: { gap: SPACING.sm },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.darkGray, marginBottom: SPACING.xs },
  inputGroup: { gap: 4 },
  inputLabel: { fontSize: 12, color: COLORS.gray, fontWeight: '500' },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.primaryGreen,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    fontSize: 16,
    color: COLORS.darkGray,
    backgroundColor: COLORS.offWhite,
  },
  result: {
    backgroundColor: '#F0FFF0',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryGreen,
    gap: SPACING.xs,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: { fontSize: 14, color: COLORS.darkGray },
  resultValue: { fontSize: 15, fontWeight: '700' },
  tip: { fontSize: 12, color: COLORS.gray, fontStyle: 'italic', marginTop: 4 },
});

const SIMULATOR_COMPONENTS = {
  cdt: CDTSimulator,
  deuda: DeudaSimulator,
  emergencia: EmergenciaSimulator,
  ahorro: AhorroSimulator,
  pension: PensionSimulator,
  prestamos: PrestamosSimulator,
};

export default function SimuladoresScreen({ navigation }) {
  const [activeSimulator, setActiveSimulator] = useState(null);

  const SimComponent = activeSimulator ? SIMULATOR_COMPONENTS[activeSimulator] : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {activeSimulator ? SIMULATORS.find(s => s.id === activeSimulator)?.label : 'Menú'}
        </Text>
        <LogoutButton navigation={navigation} color={COLORS.darkGray} size={24} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {!activeSimulator ? (
          <>
            <TouchableOpacity
              style={styles.simCard}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.simEmoji}>💰</Text>
              <View style={styles.simInfo}>
                <Text style={styles.simLabel}>Finanzas</Text>
                <Text style={styles.simDesc}>Ver Finanzas Personales y en Pareja</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            {SIMULATORS.map(sim => (
              <TouchableOpacity
                key={sim.id}
                style={styles.simCard}
                onPress={() => setActiveSimulator(sim.id)}
              >
                <Text style={styles.simEmoji}>{sim.emoji}</Text>
                <View style={styles.simInfo}>
                  <Text style={styles.simLabel}>{sim.label}</Text>
                  <Text style={styles.simDesc}>{sim.description}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.simWrapper}>
            {SimComponent && <SimComponent />}
          </View>
        )}

        <View style={styles.logoArea}>
          <NoloLogo size="sm" color={COLORS.darkGray} />
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: COLORS.darkGreen }]}
          onPress={() => { setActiveSimulator(null); navigation.navigate('Simuladores'); }}
        >
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, { backgroundColor: COLORS.darkGreen }]}>
          <Text style={styles.navText}>Cursos y libros</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    gap: SPACING.sm,
  },
  headerTitle: { flex: 1, fontSize: 22, fontWeight: '700', color: COLORS.darkGray },
  scroll: { flex: 1 },
  scrollContent: { padding: SPACING.md, gap: SPACING.md },
  simCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGreen,
  },
  simEmoji: { fontSize: 32 },
  simInfo: { flex: 1, gap: 2 },
  simLabel: { fontSize: 16, fontWeight: '700', color: COLORS.darkGray },
  simDesc: { fontSize: 12, color: COLORS.gray },
  arrow: { fontSize: 22, color: COLORS.darkGreen, fontWeight: '700' },
  simWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGreen,
  },
  logoArea: { alignItems: 'center', paddingVertical: SPACING.lg },
  bottomNav: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  navText: { color: COLORS.white, fontWeight: '600', fontSize: 12 },
});
