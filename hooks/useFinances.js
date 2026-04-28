import { useState, useEffect, useCallback, useMemo } from 'react';
import { MONTH_TO_NUMBER } from '../constants/monthToNumber';
import { INCOME_CATEGORIES } from '../constants/incomeCategories';
import { EXPENSE_CATEGORIES } from '../constants/expenseCategories';
import { COLORS } from '../constants/theme';
import { supabase } from '../lib/supabase';

const EMPTY_MONTH = { income: {}, expenses: {} };

function formatMoneyValue(v) {
  return `$${v.toLocaleString('es-CO')} COP`;
}

function getPercentage(val, total) {
  return total > 0 ? `${Math.round((val / total) * 100)}%` : '0%';
}

export default function useFinances(tableName, summaryColors = {}) {
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

  const loadFinances = useCallback(async () => {
    setLoading(true);
    setData(prev => {
      const yearData = prev[selectedYear] || {};
      return {
        ...prev,
        [selectedYear]: {
          ...yearData,
          [selectedMonth]: { income: {}, expenses: {} },
        },
      };
    });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const fiscalMonth = MONTH_TO_NUMBER[selectedMonth];
      const { data: row, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', user.id)
        .eq('fiscal_year', selectedYear)
        .eq('fiscal_month', fiscalMonth)
        .maybeSingle();
      if (error) throw error;
      if (!row) return;
      setData(prev => {
        const yearData = prev[selectedYear] || {};
        return {
          ...prev,
          [selectedYear]: {
            ...yearData,
            [selectedMonth]: {
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
            },
          },
        };
      });
    } catch {
      // ignore load errors silently
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, tableName]);

  useEffect(() => {
    loadFinances();
  }, [loadFinances]);

  const saveFinances = useCallback(async () => {
    setSaving(true);
    setSaveError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sin sesión activa');
      const fiscalMonth = MONTH_TO_NUMBER[selectedMonth];
      const md = data?.[selectedYear]?.[selectedMonth] || EMPTY_MONTH;
      const { error } = await supabase
        .from(tableName)
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
  }, [data, selectedMonth, selectedYear, tableName]);

  const monthData = useMemo(
    () => data?.[selectedYear]?.[selectedMonth] || EMPTY_MONTH,
    [data, selectedYear, selectedMonth]
  );

  const totalIncome = useMemo(
    () => Object.values(monthData.income || {}).reduce((s, v) => s + v, 0),
    [monthData]
  );

  const totalExpenses = useMemo(
    () => Object.values(monthData.expenses || {}).reduce((s, v) => s + v, 0),
    [monthData]
  );

  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const incomeChartData = useMemo(() =>
    INCOME_CATEGORIES
      .filter(c => (monthData.income?.[c.id] || 0) > 0)
      .map(c => ({ value: monthData.income[c.id], color: c.color, label: c.label })),
    [monthData]
  );

  const expenseChartData = useMemo(() =>
    EXPENSE_CATEGORIES
      .filter(c => (monthData.expenses?.[c.id] || 0) > 0)
      .map(c => ({ value: monthData.expenses[c.id], color: c.color, label: c.label })),
    [monthData]
  );

  const summaryChartData = useMemo(() => {
    const items = [
      { value: totalIncome, color: summaryColors.income || COLORS.chartGreen2, label: 'Ingresos' },
      { value: totalExpenses, color: summaryColors.expense || COLORS.chartRed, label: 'Gastos' },
      { value: Math.max(balance, 0), color: summaryColors.balance || COLORS.chartGreen1, label: 'Saldo' },
    ].filter(d => d.value > 0);
    return items;
  }, [totalIncome, totalExpenses, balance, summaryColors]);

  const summaryTotal = useMemo(
    () => summaryChartData.reduce((s, d) => s + d.value, 0),
    [summaryChartData]
  );

  const openEdit = useCallback((cat, type) => {
    setEditCategory({ ...cat, type });
    const val = type === 'income'
      ? (monthData.income?.[cat.id] || 0)
      : (monthData.expenses?.[cat.id] || 0);
    setEditValue(String(val));
    setModalVisible(true);
  }, [monthData]);

  const saveEdit = useCallback(() => {
    const numVal = parseInt(editValue.replace(/\D/g, '')) || 0;
    setData(prev => {
      const yearData = prev[selectedYear] || {};
      const monthData = yearData[selectedMonth] || { income: {}, expenses: {} };
      return {
        ...prev,
        [selectedYear]: {
          ...yearData,
          [selectedMonth]: {
            ...monthData,
            [editCategory.type === 'income' ? 'income' : 'expenses']: {
              ...monthData[editCategory.type === 'income' ? 'income' : 'expenses'],
              [editCategory.id]: numVal,
            },
          },
        },
      };
    });
    setModalVisible(false);
  }, [editValue, editCategory, selectedYear, selectedMonth]);

  const fmt = formatMoneyValue;
  const getPct = getPercentage;

  return {
    activeTab,
    setActiveTab,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    data,
    modalVisible,
    setModalVisible,
    editCategory,
    editValue,
    setEditValue,
    loading,
    saving,
    saveError,
    monthData,
    totalIncome,
    totalExpenses,
    balance,
    incomeChartData,
    expenseChartData,
    summaryChartData,
    summaryTotal,
    saveFinances,
    openEdit,
    saveEdit,
    fmt,
    getPct,
  };
}

