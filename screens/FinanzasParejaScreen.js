import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  TextInput, Modal, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import BottomNav from '../components/BottomNav';
import LogoutButton from '../components/LogoutButton';
import MonthSelector from '../components/MonthSelector';
import PieChart from '../components/PieChart';
import styles from '../styles/screens/FinanzasParejaScreen.styles';
import { formatMoney } from '../utils/formatMoney';
import { ROUTES } from '../constants/routes';
import { EXPENSE_CATEGORIES } from '../constants/expenseCategories';
import { INCOME_CATEGORIES } from '../constants/incomeCategories';
import { TABS } from '../constants/tabsFinance';
import { MONTH_TO_NUMBER } from '../constants/monthToNumber';
import { supabase } from '../lib/supabase';

const EMPTY_MONTH = { income: {}, expenses: {} };

export default function FinanzasParejaScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Ingresos');
  const [selectedMonth, setSelectedMonth] = useState('Enero');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [data, setData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    loadFinances();
  }, [selectedMonth, selectedYear]);

  const loadFinances = async () => {
    setLoading(true);
    setData(prev => {
      const updated = { ...prev };
      if (!updated[selectedYear]) updated[selectedYear] = {};
      updated[selectedYear][selectedMonth] = { income: {}, expenses: {} };
      return updated;
    });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const fiscalMonth = MONTH_TO_NUMBER[selectedMonth];
      const { data: row, error } = await supabase
        .from('couple_finances')
        .select('*')
        .eq('user_id', user.id)
        .eq('fiscal_year', selectedYear)
        .eq('fiscal_month', fiscalMonth)
        .maybeSingle();
      if (error) throw error;
      if (!row) return;
      setData(prev => {
        const updated = { ...prev };
        if (!updated[selectedYear]) updated[selectedYear] = {};
        updated[selectedYear][selectedMonth] = {
          income: {
            salario: Number(row.salary) || 0,
            bonos: Number(row.bonuses) || 0,
            dividendos: Number(row.dividends) || 0,
            comisiones: Number(row.commissions) || 0,
            otros: Number(row.other_income) || 0,
          },
          expenses: {
            hogar: Number(row.housing) || 0,
            comida: Number(row.food) || 0,
            transporte: Number(row.transportation) || 0,
            deudas: Number(row.debts) || 0,
            entretenimiento: Number(row.entertainment) || 0,
            familia: Number(row.family) || 0,
          },
        };
        return { ...updated };
      });
    } catch {
      // ignore load errors silently
    } finally {
      setLoading(false);
    }
  };

  const saveFinances = async () => {
    setSaving(true);
    setSaveError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sin sesión activa');
      const fiscalMonth = MONTH_TO_NUMBER[selectedMonth];
      const md = data?.[selectedYear]?.[selectedMonth] || EMPTY_MONTH;
      const { error } = await supabase
        .from('couple_finances')
        .upsert({
          user_id: user.id,
          fiscal_year: selectedYear,
          fiscal_month: fiscalMonth,
          salary: md.income?.salario || 0,
          bonuses: md.income?.bonos || 0,
          dividends: md.income?.dividendos || 0,
          commissions: md.income?.comisiones || 0,
          other_income: md.income?.otros || 0,
          housing: md.expenses?.hogar || 0,
          food: md.expenses?.comida || 0,
          transportation: md.expenses?.transporte || 0,
          debts: md.expenses?.deudas || 0,
          entertainment: md.expenses?.entretenimiento || 0,
          family: md.expenses?.familia || 0,
        }, { onConflict: 'user_id,fiscal_year,fiscal_month' });
      if (error) throw error;
    } catch (e) {
      setSaveError(e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const getMonthData = () => data?.[selectedYear]?.[selectedMonth] || EMPTY_MONTH;
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

  const summaryTotal = summaryChartData.reduce((s, d) => s + d.value, 0);

  const fmt = (v) => `$${v.toLocaleString('es-CO')} COP`;
  const getPct = (val, total) => total > 0 ? `${Math.round((val / total) * 100)}%` : '0%';

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
        <View style={styles.balanceRight}>
          <Text style={styles.periodText}>{selectedMonth} {selectedYear}</Text>
          {loading && <ActivityIndicator size="small" color={COLORS.darkYellow} style={{ marginLeft: 6 }} />}
        </View>
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
                    {(monthData.income?.[cat.id] || 0) > 0 && (
                      <Text style={styles.catValue}>{fmt(monthData.income[cat.id])}</Text>
                    )}
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
                        <View key={d.label} style={styles.legendItem}>
                          <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                          <Text style={styles.legendText}>
                            {d.label} {getPct(d.value, totalIncome)}
                          </Text>
                        </View>
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
                    {(monthData.expenses?.[cat.id] || 0) > 0 && (
                      <Text style={styles.catValue}>{fmt(monthData.expenses[cat.id])}</Text>
                    )}
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
                        <View key={d.label} style={styles.legendItem}>
                          <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                          <Text style={styles.legendText}>
                            {d.label} {getPct(d.value, totalExpenses)}
                          </Text>
                        </View>
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
                  { label: 'Ingresos', value: totalIncome },
                  { label: 'Gastos', value: totalExpenses },
                  { label: 'Saldo', value: balance },
                ].map(item => (
                  <View key={item.label} style={[styles.resumeRow, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <Text style={styles.resumeLabel}>{item.label}</Text>
                    <Text style={styles.resumeLabel}>{fmt(item.value)}</Text>
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
                        <View key={d.label} style={styles.legendItem}>
                          <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                          <Text style={styles.legendText}>
                            {d.label} {getPct(d.value, summaryTotal)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
            </View>
            {saveError ? <Text style={styles.saveError}>{saveError}</Text> : null}
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={saveFinances}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color={COLORS.white} />
                : <Text style={styles.saveBtnText}>Aceptar</Text>
              }
            </TouchableOpacity>
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
        onInicio={() => navigation.navigate(ROUTES.SIMULADORES)}
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
