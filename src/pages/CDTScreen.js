import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { SimInput, ResultRow, simStyles, SimInputDecimal } from '../components/SimulatorComponents';
import NoloLogo from '../components/NoloLogo';
import styles from '../styles/pages/simulator.styles';
import LogoutButton from '../components/LogoutButton';
import { ROUTES } from "../constants/routes";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Field } from '../components/Field';
import Checkbox from '../components/Checkbox';

export default function CDTScreen({ navigation }) {
  const [capital, setCapital] = useState('');
  const [rate, setRate] = useState('');
  const [days, setDays] = useState('');
  const [percentage, setPercentage] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateValue, setDateValue] = useState(new Date(2000, 0, 1));
  const [checked, setChecked] = useState(false);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const handleDate = () => {
    const valueNum = parseInt(days);

    if (!valueNum || valueNum % 30 !== 0) {
      setErrorPopupVisible(true);
      setTimeout(() => setErrorPopupVisible(false), 3000);
      setDays('');
    }
  }
  const sumDaysToDate = (dateString, daysToAdd) => {
    if (!dateString || !daysToAdd) return null;

    const [day, month, year] = dateString.split('/');

    const date = new Date(Number(year), Number(month) - 1, Number(day));

    if (isNaN(date.getTime())) return null;

    date.setDate(date.getDate() + Number(daysToAdd));

    return date;
  };
  const expirationDate = sumDaysToDate(selectedDate, days);
  const formatDate = (date) => {
      if (!date) return '';

      const d = String(date.getDate()).padStart(2, '0');
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const y = date.getFullYear();
      return `${d}/${m}/${y}`;
  };
  const formatted = formatDate(expirationDate);
  const dailyPercent  = (((1 + (parseFloat(rate) / 100)) ** (1 / 365) - 1) * 100).toFixed(4);
  const grossInterest = Math.round(parseFloat(capital) * (1 + (parseFloat(rate) / 100) * (parseInt(days) / 365))) - (parseFloat(capital) || 0);
  const withholdingTax = -grossInterest * (parseFloat(percentage) / 100);
  const gmf = checked ? -(parseInt(capital) + parseInt(grossInterest)) * 0.004 : 0;
  const netInterest = grossInterest + withholdingTax + gmf;
  const netProfitability = (netInterest / parseFloat(capital) * (365 / parseInt(days)) * 100).toFixed(2);
  const result = parseInt(capital) + parseInt(netInterest) 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🏦 CDT</Text>
        <View style={styles.backBtn} />
        <LogoutButton navigation={navigation} color={COLORS.darkGray} size={26} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.description}>
            Simula el rendimiento de un Certificado de Depósito a Término.
          </Text>

          <SimInput label="Capital inicial (COP)" value={capital} onChange={setCapital} money />
          <SimInputDecimal label="Tasa EA (%)" value={rate} onChange={setRate} decimal />
          <SimInput label="Plazo (días)" value={days} onChange={setDays} onEndEditing={handleDate} money />
          <Field label="Fecha de inicio">
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
                onChange={(_, selected) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selected) {
                    setDateValue(selected);

                    const y = selected.getFullYear();
                    const m = String(selected.getMonth() + 1).padStart(2, '0');
                    const d = String(selected.getDate()).padStart(2, '0');

                    setSelectedDate(`${d}/${m}/${y}`);
                  }
                }}
              />
            )}
          </Field>
          <SimInputDecimal label="Retención en la fuente (%)" value={percentage} onChange={setPercentage} decimal />
          <Checkbox value={checked} onChange={setChecked} label="4x1000 sobre retiro" />

          {result > 0 && (
            <View style={simStyles.result}>
              <ResultRow label="Fecha de vencimiento" value={formatted} color={COLORS.darkGreen} />
              <ResultRow label="Días efectivos" value={days} color={COLORS.darkGreen} />
              <ResultRow label="Tasa nominal diaria (%)" value={`${dailyPercent }%`} color={COLORS.darkGreen} />
              <ResultRow label="Intereses brutos (COP)" value={`$${grossInterest.toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
              <ResultRow label="Retención en la fuente" value={`$${parseInt(withholdingTax).toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
              <ResultRow label="GMF 4x1000 estimado" value={`$${parseInt(gmf).toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
              <ResultRow label="Intereses netos (COP)" value={`$${parseInt(netInterest).toLocaleString('es-CO')}`} color={COLORS.darkGreen} />
              <ResultRow label="Rentabilidad neta E.A." value={`${netProfitability}%`} color={COLORS.darkGreen} />
              <ResultRow label="Total a recibir (COP)" value={`$${result.toLocaleString('es-CO')}`} color={COLORS.dark} total />
            </View>
          )}

          {result > 0 && parseInt(days) >= 30 && (
            <View style={{ marginTop: 16, borderRadius: 8, overflow: 'hidden' }}>
              <View style={{ backgroundColor: '#1a3a5c', padding: 12 }}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                  📊 Proyección mensual de rendimiento
                </Text>
              </View>
              <View style={{ flexDirection: 'row', backgroundColor: '#1a3a5c', paddingVertical: 8, paddingHorizontal: 4, borderTopWidth: 1, borderTopColor: '#2a4a6c' }}>
                <Text style={{ flex: 1, color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>Mes</Text>
                <Text style={{ flex: 2, color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>Intereses acumulados</Text>
                <Text style={{ flex: 2, color: 'white', fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>Capital + Intereses</Text>
              </View>
              {Array.from({ length: Math.floor(parseInt(days) / 30) }, (_, i) => {
                const month = i + 1;
                const accInterest = Math.round(parseFloat(capital) * (parseFloat(rate) / 100) * (month * 30 / 365));
                const total = parseFloat(capital) + accInterest;
                return (
                  <View key={month} style={{ flexDirection: 'row', backgroundColor: i % 2 === 0 ? '#ffffff' : '#ddeeff', paddingVertical: 8, paddingHorizontal: 4 }}>
                    <Text style={{ flex: 1, textAlign: 'center', color: '#333', fontSize: 13 }}>Mes {month}</Text>
                    <Text style={{ flex: 2, textAlign: 'center', color: COLORS.darkGreen, fontWeight: 'bold', fontSize: 13 }}>
                      ${accInterest.toLocaleString('es-CO')}
                    </Text>
                    <Text style={{ flex: 2, textAlign: 'center', color: '#0066cc', fontWeight: 'bold', fontSize: 13 }}>
                      ${total.toLocaleString('es-CO')}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.logoArea}>
            <NoloLogo size="sm" color={COLORS.darkGray} />
            <Text style={styles.byline}>by la Peliroja Financiera</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomNav}>
          <TouchableOpacity
              style={[styles.navBtn, { backgroundColor: COLORS.darkGreen }]}
              onPress={() => navigation.navigate(ROUTES.SIMULATORS)}
          >
              <Text style={styles.navText}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[styles.navBtn, { backgroundColor: COLORS.darkGreen }]}
              onPress={() => navigation.navigate(ROUTES.WELCOME)}
          >
              <Text style={styles.navText}>Cursos y libros</Text>
          </TouchableOpacity>
      </View>

      <Modal visible={errorPopupVisible} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <View style={[styles.popupIconCircle, styles.popupIconCircleError]}>
              <Text style={styles.popupIconText}>!</Text>
            </View>
            <Text style={[styles.popupTitle, styles.popupTitleError]}>Campo Errado</Text>
            <Text style={styles.popupMessage}>El plazo debe ser un múltiplo de 30 días.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

