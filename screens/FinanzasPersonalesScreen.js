import { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  TextInput, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import BottomNav from '../components/BottomNav';
import LogoutButton from '../components/LogoutButton';
import MonthSelector from '../components/MonthSelector';
import PieChart from '../components/PieChart';
import styles from '../styles/screens/FinanzasPersonalesScreen.styles';
import { formatMoney } from '../utils/formatMoney';
import { ROUTES } from '../constants/routes';

const INCOME_CATEGORIES = [
  { id: 'salario', label: 'Salario', emoji: '👤', color: COLORS.chartGreen2 },
  { id: 'bonos', label: 'Bonos', emoji: '📊', color: COLORS.chartGreen1 },
  { id: 'dividendos', label: 'Dividendos', emoji: '💸', color: COLORS.chartGreen3 },
  { id: 'comisiones', label: 'Comisiones', emoji: '💲', color: '#A0D060' },
  { id: 'otros', label: 'Otros', emoji: '🤲', color: '#D0E890' },
];

const EXPENSE_CATEGORIES = [
  { id: 'hogar', label: 'Hogar', emoji: '🏠', color: COLORS.chartYellow },
  { id: 'comida', label: 'Comida', emoji: '🍽️', color: COLORS.chartOrange },
  { id: 'transporte', label: 'Trasporte', emoji: '🚌', color: COLORS.chartBrown },
  { id: 'deudas', label: 'Deudas', emoji: '💳', color: COLORS.chartRed },
  { id: 'entretenimiento', label: 'Entretenimiento', emoji: '📺', color: COLORS.chartNavy },
  { id: 'familia', label: 'Familia', emoji: '👨‍👩‍👧', color: '#88AABB' },
];

const TABS = ['Ingresos', 'Gastos', 'Saldo'];

const INITIAL_DATA = {
  2025: {
    Enero: {
      income: { salario: 2800000, bonos: 800000, dividendos: 200000, comisiones: 150000, otros: 50000 },
      expenses: { hogar: 673000, comida: 192000, transporte: 48000, deudas: 0, entretenimiento: 29000, familia: 58000 },
    },
  },
};

export default function FinanzasPersonalesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Ingresos');
  const [selectedMonth, setSelectedMonth] = useState('Enero');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [data, setData] = useState(INITIAL_DATA);
  const [modalVisible, setModalVisible] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editValue, setEditValue] = useState('');

  const getMonthData = () => {
    return data?.[selectedYear]?.[selectedMonth] || {
      income: {},
      expenses: {},
    };
  };

  const monthData = getMonthData();

  const totalIncome = Object.values(monthData.income || {}).reduce((s, v) => s + v, 0);
  const totalExpenses = Object.values(monthData.expenses || {}).reduce((s, v) => s + v, 0);
  const balance = totalIncome - totalExpenses;

  const incomeChartData = INCOME_CATEGORIES
    .filter(c => (monthData.income?.[c.id] || 0) > 0)
    .map(c => ({ value: monthData.income[c.id], color: c.color, label: c.label }));

  const expenseChartData = EXPENSE_CATEGORIES
    .filter(c => (monthData.expenses?.[c.id] || 0) > 0)
    .map(c => ({ value: monthData.expenses[c.id], color: c.color, label: c.label }));

  const summaryChartData = [
    { value: totalIncome, color: COLORS.chartGreen2, label: 'Ingresos' },
    { value: totalExpenses, color: COLORS.chartRed, label: 'Gastos' },
    { value: Math.max(balance, 0), color: COLORS.chartGreen1, label: 'Saldo' },
  ].filter(d => d.value > 0);

  const fmt = (v) => `$${v.toLocaleString('es-CO')} COP`;

  const openEdit = (cat, type) => {
    setEditCategory({ ...cat, type });
    const val = type === 'income'
      ? (monthData.income?.[cat.id] || 0)
      : (monthData.expenses?.[cat.id] || 0);
    setEditValue(String(val));
    setModalVisible(true);
  };

  const saveEdit = () => {
    const numVal = parseInt(editValue.replace(/\D/g, '')) || 0;
    setData(prev => {
      const updated = { ...prev };
      if (!updated[selectedYear]) updated[selectedYear] = {};
      if (!updated[selectedYear][selectedMonth]) {
        updated[selectedYear][selectedMonth] = { income: {}, expenses: {} };
      }
      if (editCategory.type === 'income') {
        updated[selectedYear][selectedMonth].income = {
          ...updated[selectedYear][selectedMonth].income,
          [editCategory.id]: numVal,
        };
      } else {
        updated[selectedYear][selectedMonth].expenses = {
          ...updated[selectedYear][selectedMonth].expenses,
          [editCategory.id]: numVal,
        };
      }
      return { ...updated };
    });
    setModalVisible(false);
  };

  const getPct = (val, total) => total > 0 ? `${Math.round((val / total) * 100)}%` : '0%';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>💰</Text>
        <Text style={styles.headerTitle}>Finanzas Personales</Text>
        <LogoutButton navigation={navigation} color={COLORS.darkGray} size={24} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Balance bar */}
      <View style={styles.balanceBar}>
        <Text style={styles.balanceText}>Saldo: {fmt(balance)}</Text>
        <Text style={styles.periodText}>{selectedMonth} {selectedYear} ›</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Income Tab */}
        {activeTab === 'Ingresos' && (
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.categoryList}>
                {INCOME_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.categoryRow}
                    onPress={() => openEdit(cat, 'income')}
                  >
                    <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                    <Text style={styles.catLabel}>{cat.label}</Text>
                    <Text style={styles.catEmoji}>{cat.emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.chartArea}>
                {incomeChartData.length > 0 && (
                  <>
                    <PieChart data={incomeChartData} size={140} />
                    <View style={styles.chartLegend}>
                      {incomeChartData.map(d => (
                        <Text key={d.label} style={[styles.legendText, { color: d.color }]}>
                          {d.label} {getPct(d.value, totalIncome)}
                        </Text>
                      ))}
                    </View>
                  </>
                )}
              </View>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Ingresos:</Text>
              <Text style={styles.totalValue}>{fmt(totalIncome)}</Text>
            </View>
          </View>
        )}

        {/* Expenses Tab */}
        {activeTab === 'Gastos' && (
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.categoryList}>
                {EXPENSE_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.categoryRow}
                    onPress={() => openEdit(cat, 'expenses')}
                  >
                    <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                    <Text style={styles.catLabel}>{cat.label}</Text>
                    <Text style={styles.catEmoji}>{cat.emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.chartArea}>
                {expenseChartData.length > 0 && (
                  <>
                    <PieChart data={expenseChartData} size={140} />
                    <View style={styles.chartLegend}>
                      {expenseChartData.map(d => (
                        <Text key={d.label} style={[styles.legendText, { color: d.color }]}>
                          {d.label} {getPct(d.value, totalExpenses)}
                        </Text>
                      ))}
                    </View>
                  </>
                )}
              </View>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Gastos:</Text>
              <Text style={styles.totalValue}>{fmt(totalExpenses)}</Text>
            </View>
          </View>
        )}

        {/* Balance Tab */}
        {activeTab === 'Saldo' && (
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.categoryList}>
                <Text style={styles.resumeTitle}>Resumen</Text>
                {[
                  { label: 'Ingresos', value: totalIncome },
                  { label: 'Gastos', value: totalExpenses },
                  { label: 'Saldo', value: balance },
                ].map(item => (
                  <View key={item.label} style={styles.resumeRow}>
                    <Text style={styles.resumeLabel}>{item.label}</Text>
                  </View>
                ))}
                <View style={styles.resumeHighlight}>
                  <Text style={styles.resumeHighlightText}>📊 {fmt(balance)}</Text>
                </View>
              </View>
              <View style={styles.chartArea}>
                {summaryChartData.length > 0 && (
                  <>
                    <PieChart data={summaryChartData} size={140} innerRadius={40} />
                    <View style={styles.chartLegend}>
                      {summaryChartData.map(d => (
                        <Text key={d.label} style={[styles.legendText, { color: d.color }]}>
                          {d.label} {getPct(d.value, totalIncome + totalExpenses + balance)}
                        </Text>
                      ))}
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Month selector */}
        <View style={styles.selectorHeader}>
          <Text style={styles.selectorLabel}>Mes ›</Text>
        </View>
        <MonthSelector
          selected={selectedMonth}
          onSelect={setSelectedMonth}
          accentColor={COLORS.darkGreen}
        />

        {/* Year selector */}
        <View style={styles.selectorHeader}>
          <Text style={styles.selectorLabel}>Año ›</Text>
        </View>
        <View style={styles.yearSelector}>
          {[selectedYear + 1, selectedYear, selectedYear - 1].map(y => (
            <TouchableOpacity key={y} onPress={() => setSelectedYear(y)}>
              <Text style={[styles.yearText, y === selectedYear && styles.yearActive]}>
                {y}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nolo logo */}
        <View style={styles.logoArea}>
          <NoloLogo size="sm" color={COLORS.darkGray} />
        </View>
      </ScrollView>

      <BottomNav
        onInicio={() => navigation.navigate(ROUTES.SIMULADORES)}
        accentColor={COLORS.darkGreen}
      />

      {/* Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {editCategory?.emoji} {editCategory?.label}
            </Text>
            <Text style={styles.modalSubtitle}>
              {editCategory?.type === 'income' ? 'Ingreso (COP)' : 'Gasto (COP)'}
            </Text>
            <TextInput
              style={styles.modalInput}
              value={formatMoney(editValue)}
              onChangeText={(text) => setEditValue(text.replace(/[^0-9]/g, ''))}
              keyboardType="numeric"
              placeholder="0"
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: COLORS.lightGray }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: COLORS.darkGreen }]}
                onPress={saveEdit}
              >
                <Text style={[styles.modalBtnText, { color: COLORS.white }]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

