import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import PieChart from '../PieChart';

export default function SummarySection({
  totalIncome,
  totalExpenses,
  balance,
  chartData,
  chartTotal,
  fmt,
  getPct,
  saveFinances,
  saving,
  saveError,
  styles,
}) {
  const items = [
    { label: 'Ingresos', value: totalIncome },
    { label: 'Gastos', value: totalExpenses },
    { label: 'Saldo', value: balance },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <View style={styles.categoryList}>
          <Text style={styles.resumeTitle}>Resumen</Text>
          {items.map(item => (
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
          {chartData.length > 0 && (
            <>
              <PieChart data={chartData} size={140} innerRadius={40} />
              <View style={styles.chartLegend}>
                {chartData.map(d => (
                  <View key={d.label} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                    <Text style={styles.legendText}>
                      {d.label} {getPct(d.value, chartTotal)}
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
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.saveBtnText}>Aceptar</Text>
        }
      </TouchableOpacity>
    </View>
  );
}
