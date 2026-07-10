import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { SimInput, SimSelect, ResultRow, simStyles } from '../components/SimulatorComponents';
import NoloLogo from '../components/NoloLogo';
import styles from '../styles/pages/simulator.styles';
import LogoutButton from '../components/LogoutButton';
import BottomNav from '../components/BottomNav';
import { Field } from '../components/Field';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function BankDebtScreen({ navigation }) {
  const [debt, setDebt]                 = useState('');
  const [rate, setRate]                 = useState('');
  const [rateType, setRateType]         = useState('EA');
  const [month, setMonth]               = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue]       = useState(new Date(2000, 0, 1));
  const [feeType, setfeeType]           = useState('FIJA');
  const [lifeInsurance, setLifeInsurance] = useState('');
  const [unemployment, setUnemployment] = useState('');
  
  const valueRate = (100 + (parseFloat(rate))).toFixed(3)
  const exponent = (1 / 12).toFixed(6)
  const effectiveAnnualRate = (((valueRate / 100) ** exponent - 1) * 100).toFixed(4);
  
  const effectivemonthlyrate = (rateType) => {
    const result = rateType === 'EA' ? effectiveAnnualRate
                 : rateType === 'NMV' ? (parseFloat(rate) / 12)
                 : rateType === 'NMB' ? (parseFloat(rate) / 6)
                 : 0;
    return result;
  };
  const effectiveMonthlyRateValue = effectivemonthlyrate(rateType);

  const rr = ((100 + (effectiveMonthlyRateValue / 100))) ** 12
  console.log("primer: ", (100 + (effectiveMonthlyRateValue / 100)))  
  console.log("segundo: ", ((100 + (effectiveMonthlyRateValue / 100))) ** 12)
  console.log("tercero: ", rr.toFixed(6))
  const annualEffectiveRate = ((100 + (effectiveMonthlyRateValue / 100 ) ** 12) - 1).toFixed(2);
  const monthdefeated = effectivemonthlyrate(rateType) / 12;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💳 Deuda Banco</Text>
        <View style={styles.backBtn} />
        <LogoutButton navigation={navigation} color={COLORS.darkGray} size={26} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          Calcula el costo real de tu deuda bancaria.
        </Text>

        <SimInput label="Monto del préstamo (COP)" value={debt} onChange={setDebt} money />
        <SimSelect
          label="Tipo de tasa"
          value={rateType}
          onChange={setRateType}
          options={['EA', 'NMV', 'NMB']}
        />
        <SimInput label="Tasa ingresada (%)" value={rate} onChange={setRate} decimal />
        <SimInput label="Plazo (meses)" value={month} onChange={setMonth} money />
        <Field label="Fecha primer pago">
          <TouchableOpacity
            style={styles.inputRow}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.input, !selectedDate && { color: COLORS.gray }]}>
              {selectedDate || 'Seleccione una fecha'}
            </Text>
            <Text style={{ fontSize: 18, color: COLORS.darkGray }}>📅</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateValue}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date(2100, 0, 1)}
              minimumDate={new Date()}
              onValueChange={(_, selected) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selected) {
                  setDateValue(selected);
                  const y = selected.getFullYear();
                  const m = String(selected.getMonth() + 1).padStart(2, '0');
                  const d = String(selected.getDate()).padStart(2, '0');
                  setSelectedDate(`${d}/${m}/${y}`);
                }
              }}
              onDismiss={() => setShowDatePicker(false)}
            />
          )}
        </Field>
        <SimInput label="Tipo cuota" value={feeType} onChange={setfeeType} />
        <SimInput label="Seguro de vida mensual (COP)" value={lifeInsurance} onChange={setLifeInsurance} money />
        <SimInput label="Seguro de desempleo mensual (COP)" value={unemployment} onChange={setUnemployment} money />

        {month > 0 && (
          <View style={simStyles.result}>
            <ResultRow label="Tasa mensual efectiva (%)"              value={`${effectiveMonthlyRateValue}%`} color={COLORS.chartRed} />
            <ResultRow label="Tasa efectiva anual equivalente (%)"    value={`${annualEffectiveRate}%`}       color={COLORS.chartOrange} />
            <ResultRow label="Tasa nominal mes vencido (NMV) equiv."  value={`${monthdefeated}%`}             color={COLORS.chartOrange} />
            <ResultRow label="Costo total del crédito (COP)"          value="—"                               color={COLORS.chartOrange} />
            <ResultRow label="Total intereses pagados (COP)"          value="—"                               color={COLORS.chartOrange} />
            <ResultRow label="Cuota mensual base (COP)"               value="—"                               color={COLORS.darkGreen} />
            <ResultRow label="Cuota total con seguros (COP)"          value="—"                               color={COLORS.darkGreen} />
          </View>
        )}
        <NoloLogo size="sm" />
      </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
}
