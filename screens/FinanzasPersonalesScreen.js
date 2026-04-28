import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';
import BottomNav from '../components/BottomNav';
import MonthSelector from '../components/MonthSelector';
import FinanceHeader from '../components/finances/FinanceHeader';
import FinanceTabs from '../components/finances/FinanceTabs';
import BalanceBar from '../components/finances/BalanceBar';
import CategorySection from '../components/finances/CategorySection';
import SummarySection from '../components/finances/SummarySection';
import EditModal from '../components/finances/EditModal';
import SuccessModal from '../components/SuccessModal';
import YearSelector from '../components/finances/YearSelector';
import styles from '../styles/screens/FinanzasPersonalesScreen.styles';
import { ROUTES } from '../constants/routes';
import { EXPENSE_CATEGORIES } from '../constants/expenseCategories';
import { INCOME_CATEGORIES } from '../constants/incomeCategories';
import useFinances from '../hooks/useFinances';

export default function FinanzasPersonalesScreen({ navigation }) {
  const finance = useFinances('personal_finances', {
    income: COLORS.chartGreen2,
    expense: COLORS.chartRed,
    balance: COLORS.chartGreen1,
  });

  return (
    <SafeAreaView style={styles.container}>
      <FinanceHeader
        emoji="💰"
        title="Finanzas Personales"
        navigation={navigation}
        color={COLORS.darkGray}
        styles={styles}
      />

      <FinanceTabs
        activeTab={finance.activeTab}
        setActiveTab={finance.setActiveTab}
        styles={styles}
      />

      <BalanceBar
        balance={finance.balance}
        selectedMonth={finance.selectedMonth}
        selectedYear={finance.selectedYear}
        loading={finance.loading}
        fmt={finance.fmt}
        accentColor={COLORS.darkGreen}
        styles={styles}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {finance.activeTab === 'Ingresos' && (
          <CategorySection
            categories={INCOME_CATEGORIES}
            type="income"
            monthData={finance.monthData}
            chartData={finance.incomeChartData}
            total={finance.totalIncome}
            fmt={finance.fmt}
            getPct={finance.getPct}
            openEdit={finance.openEdit}
            styles={styles}
          />
        )}

        {finance.activeTab === 'Gastos' && (
          <CategorySection
            categories={EXPENSE_CATEGORIES}
            type="expenses"
            monthData={finance.monthData}
            chartData={finance.expenseChartData}
            total={finance.totalExpenses}
            fmt={finance.fmt}
            getPct={finance.getPct}
            openEdit={finance.openEdit}
            styles={styles}
          />
        )}

        {finance.activeTab === 'Saldo' && (
          <SummarySection
            totalIncome={finance.totalIncome}
            totalExpenses={finance.totalExpenses}
            balance={finance.balance}
            chartData={finance.summaryChartData}
            chartTotal={finance.summaryTotal}
            fmt={finance.fmt}
            getPct={finance.getPct}
            saveFinances={finance.saveFinances}
            saving={finance.saving}
            saveError={finance.saveError}
            styles={styles}
          />
        )}

        <View style={styles.selectorHeader}>
          <Text style={styles.selectorLabel}>Mes ›</Text>
        </View>
        <MonthSelector
          selected={finance.selectedMonth}
          onSelect={finance.setSelectedMonth}
          accentColor={COLORS.darkGreen}
        />

        <View style={styles.selectorHeader}>
          <Text style={styles.selectorLabel}>Año ›</Text>
        </View>
        <YearSelector
          selectedYear={finance.selectedYear}
          setSelectedYear={finance.setSelectedYear}
          styles={styles}
        />

        <View style={styles.logoArea}>
          <NoloLogo size="sm" color={COLORS.darkGray} />
        </View>
      </ScrollView>

      <BottomNav
        onInicio={() => navigation.navigate(ROUTES.SIMULADORES)}
        accentColor={COLORS.darkGreen}
      />

      <EditModal
        visible={finance.modalVisible}
        editCategory={finance.editCategory}
        editValue={finance.editValue}
        setEditValue={finance.setEditValue}
        onSave={finance.saveEdit}
        onCancel={() => finance.setModalVisible(false)}
        accentColor={COLORS.darkGreen}
        styles={styles}
      />

      <SuccessModal
        visible={finance.saveSuccess}
        message="El registro se ha guardado exitosamente."
        onClose={finance.clearSaveSuccess}
        accentColor={COLORS.darkGreen}
      />
    </SafeAreaView>
  );
}

