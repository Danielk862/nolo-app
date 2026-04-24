import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, SafeAreaView, TextInput, Modal,
  Alert
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import BottomNav from '../components/BottomNav';
import LogoutButton from '../components/LogoutButton';
import MonthSelector from '../components/MonthSelector';
import PieChart from '../components/PieChart';

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
        onInicio={() => navigation.navigate('Simuladores')}
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
              value={editValue}
              onChangeText={setEditValue}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  headerEmoji: { fontSize: 28 },
  headerTitle: { flex: 1, fontSize: 22, fontWeight: '700', color: COLORS.darkGray },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    backgroundColor: COLORS.primaryGreen,
  },
  tabActive: { backgroundColor: COLORS.darkGreen },
  tabText: { color: COLORS.darkGray, fontWeight: '600', fontSize: 14 },
  tabTextActive: { color: COLORS.white },
  balanceBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.offWhite,
  },
  balanceText: { fontSize: 14, fontWeight: '600', color: COLORS.darkGray },
  periodText: { fontSize: 14, color: COLORS.gray },
  scroll: { flex: 1 },
  section: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  categoryList: {
    flex: 1,
    gap: SPACING.xs,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
  },
  catDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  catLabel: { flex: 1, fontSize: 13, color: COLORS.darkGray, fontWeight: '500' },
  catEmoji: { fontSize: 16 },
  chartArea: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  chartLegend: {
    marginTop: SPACING.xs,
    gap: 2,
    alignItems: 'center',
  },
  legendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  totalLabel: { fontSize: 14, fontWeight: '600', color: COLORS.darkGray },
  totalValue: { fontSize: 14, fontWeight: '700', color: COLORS.darkGreen },
  resumeTitle: { fontSize: 16, fontWeight: '700', color: COLORS.darkGray, marginBottom: SPACING.xs },
  resumeRow: {
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: 4,
  },
  resumeLabel: { fontSize: 13, color: COLORS.darkGray },
  resumeHighlight: {
    backgroundColor: '#FFFACC',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#E8D800',
    marginTop: SPACING.xs,
  },
  resumeHighlightText: { fontSize: 13, fontWeight: '700', color: COLORS.darkGray },
  selectorHeader: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    backgroundColor: COLORS.lightGray,
    paddingBottom: SPACING.xs,
  },
  selectorLabel: { fontSize: 13, fontWeight: '600', color: COLORS.darkGray },
  yearSelector: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.lightGray,
    gap: 4,
  },
  yearText: { fontSize: 16, color: COLORS.gray },
  yearActive: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.darkGray,
    borderWidth: 1,
    borderColor: COLORS.gray,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  logoArea: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.darkGray },
  modalSubtitle: { fontSize: 14, color: COLORS.gray },
  modalInput: {
    borderWidth: 2,
    borderColor: COLORS.primaryGreen,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  modalBtns: { flexDirection: 'row', gap: SPACING.sm },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  modalBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.darkGray },
});
