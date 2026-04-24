import { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, TextInput, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import BottomNav from '../components/BottomNav';
import LogoutButton from '../components/LogoutButton';
import MonthSelector from '../components/MonthSelector';
import PieChart from '../components/PieChart';

const INCOME_CATEGORIES = [
  { id: 'salario', label: 'Salario', emoji: '👤', color: COLORS.primaryYellow },
  { id: 'bonos', label: 'Bonos', emoji: '📊', color: '#D4870A' },
  { id: 'dividendos', label: 'Dividendos', emoji: '💸', color: '#8B5E00' },
  { id: 'comisiones', label: 'Comisiones', emoji: '💲', color: '#F0C040' },
  { id: 'otros', label: 'Otros', emoji: '🤲', color: '#E8D080' },
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
      income: { salario: 5810000, bonos: 1660000, dividendos: 415000, comisiones: 300000, otros: 115000 },
      expenses: { hogar: 1682500, comida: 480000, transporte: 120000, deudas: 100000, entretenimiento: 72500, familia: 45000 },
    },
  },
};

export default function FinanzasParejaScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Ingresos');
  const [selectedMonth, setSelectedMonth] = useState('Enero');
  const [selectedYear, setSelectedYear] = useState(2025);
  const [data, setData] = useState(INITIAL_DATA);
  const [modalVisible, setModalVisible] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editValue, setEditValue] = useState('');

  const getMonthData = () => {
    return data?.[selectedYear]?.[selectedMonth] || { income: {}, expenses: {} };
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
    { value: totalIncome, color: COLORS.primaryYellow, label: 'Ingresos' },
    { value: totalExpenses, color: COLORS.red, label: 'Gastos' },
    { value: Math.max(balance, 0), color: COLORS.primaryGreen, label: 'Saldo' },
  ].filter(d => d.value > 0);

  const fmt = (v) => `$${v.toLocaleString('es-CO')} COP`;
  const getPct = (val, total) => total > 0 ? `${Math.round((val / total) * 100)}%` : '0%';
  const formatMoney = (raw) => {
    const digits = raw.replace(/[^0-9]/g, '');
    if (!digits) return '';
    return parseInt(digits, 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

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
      const updated = JSON.parse(JSON.stringify(prev));
      if (!updated[selectedYear]) updated[selectedYear] = {};
      if (!updated[selectedYear][selectedMonth]) {
        updated[selectedYear][selectedMonth] = { income: {}, expenses: {} };
      }
      if (editCategory.type === 'income') {
        updated[selectedYear][selectedMonth].income[editCategory.id] = numVal;
      } else {
        updated[selectedYear][selectedMonth].expenses[editCategory.id] = numVal;
      }
      return updated;
    });
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>💑</Text>
        <Text style={styles.headerTitle}>Finanzas en pareja</Text>
        <LogoutButton navigation={navigation} color={COLORS.darkGray} size={24} />
      </View>

      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.tabActive,
              tab === 'Gastos' && activeTab !== tab && styles.tabGastos,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.balanceBar}>
        <Text style={styles.balanceText}>Saldo: {fmt(balance)}</Text>
        <Text style={styles.periodText}>{selectedMonth} {selectedYear} ›</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {activeTab === 'Ingresos' && (
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.categoryList}>
                {INCOME_CATEGORIES.map(cat => (
                  <TouchableOpacity key={cat.id} style={styles.categoryRow} onPress={() => openEdit(cat, 'income')}>
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
              <Text style={[styles.totalValue, { color: COLORS.primaryYellow }]}>{fmt(totalIncome)}</Text>
            </View>
          </View>
        )}

        {activeTab === 'Gastos' && (
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.categoryList}>
                {EXPENSE_CATEGORIES.map(cat => (
                  <TouchableOpacity key={cat.id} style={styles.categoryRow} onPress={() => openEdit(cat, 'expenses')}>
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
              <Text style={[styles.totalValue, { color: COLORS.red }]}>{fmt(totalExpenses)}</Text>
            </View>
          </View>
        )}

        {activeTab === 'Saldo' && (
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.categoryList}>
                <Text style={styles.resumeTitle}>Resumen</Text>
                {[
                  { label: 'Ingresos' },
                  { label: 'Gastos' },
                  { label: 'Saldo' },
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
                          {d.label}
                        </Text>
                      ))}
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
        )}

        <View style={styles.selectorHeader}>
          <Text style={styles.selectorLabel}>Mes ›</Text>
        </View>
        <MonthSelector
          selected={selectedMonth}
          onSelect={setSelectedMonth}
          accentColor={COLORS.darkYellow}
          activeBg={COLORS.primaryYellow}
        />

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

        <View style={styles.logoArea}>
          <NoloLogo size="sm" color={COLORS.darkGray} />
        </View>
      </ScrollView>

      <BottomNav
        onInicio={() => navigation.navigate('Simuladores')}
        accentColor={COLORS.primaryYellow}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editCategory?.emoji} {editCategory?.label}</Text>
            <Text style={styles.modalSubtitle}>
              {editCategory?.type === 'income' ? 'Ingreso (COP)' : 'Gasto (COP)'}
            </Text>
            <TextInput
              style={[styles.modalInput, { borderColor: COLORS.primaryYellow }]}
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
                style={[styles.modalBtn, { backgroundColor: COLORS.primaryYellow }]}
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
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerEmoji: { fontSize: 28 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: COLORS.darkGray },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.xs,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    backgroundColor: COLORS.lightYellow,
  },
  tabActive: { backgroundColor: COLORS.darkYellow },
  tabGastos: { backgroundColor: COLORS.red },
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
  section: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  row: { flexDirection: 'row', gap: SPACING.sm },
  categoryList: { flex: 1, gap: SPACING.xs },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.sm,
    paddingVertical: 8,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.xs,
  },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catLabel: { flex: 1, fontSize: 13, color: COLORS.darkGray, fontWeight: '500' },
  catEmoji: { fontSize: 16 },
  chartArea: { alignItems: 'center', justifyContent: 'flex-start', flex: 1 },
  chartLegend: { marginTop: SPACING.xs, gap: 2, alignItems: 'center' },
  legendText: { fontSize: 11, fontWeight: '600' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  totalLabel: { fontSize: 14, fontWeight: '600', color: COLORS.darkGray },
  totalValue: { fontSize: 14, fontWeight: '700' },
  resumeTitle: { fontSize: 16, fontWeight: '700', color: COLORS.darkGray, marginBottom: SPACING.xs },
  resumeRow: {
    backgroundColor: COLORS.offWhite,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: 4,
  },
  resumeLabel: { fontSize: 13, color: COLORS.darkGray },
  resumeHighlight: {
    backgroundColor: '#FFF8E0',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primaryYellow,
    marginTop: SPACING.xs,
  },
  resumeHighlightText: { fontSize: 13, fontWeight: '700', color: COLORS.darkGray },
  selectorHeader: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    backgroundColor: '#FFF8E0',
    paddingBottom: SPACING.xs,
  },
  selectorLabel: { fontSize: 13, fontWeight: '600', color: COLORS.darkGray },
  yearSelector: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: '#FFF8E0',
    gap: 4,
  },
  yearText: { fontSize: 16, color: COLORS.gray },
  yearActive: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.darkGray,
    borderWidth: 1,
    borderColor: COLORS.primaryYellow,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  logoArea: { alignItems: 'center', paddingVertical: SPACING.lg },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
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
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  modalBtns: { flexDirection: 'row', gap: SPACING.sm },
  modalBtn: { flex: 1, paddingVertical: 14, borderRadius: RADIUS.full, alignItems: 'center' },
  modalBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.darkGray },
});
