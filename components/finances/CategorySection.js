import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PieChart from '../PieChart';

export default function CategorySection({
  categories,
  type,
  monthData,
  chartData,
  total,
  fmt,
  getPct,
  openEdit,
  totalColor,
  styles,
}) {
  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <View style={styles.categoryList}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryRow}
              onPress={() => openEdit(cat, type)}
            >
              <View style={[styles.catDot, { backgroundColor: cat.color }]} />
              {(monthData[type === 'income' ? 'income' : 'expenses']?.[cat.id] || 0) > 0 ? (
                <View style={localStyles.labelValueCol}>
                  <Text style={styles.catLabel} numberOfLines={1}>{cat.label}</Text>
                  <Text style={styles.catValue} numberOfLines={1}>
                    {fmt(monthData[type === 'income' ? 'income' : 'expenses'][cat.id])}
                  </Text>
                </View>
              ) : (
                <Text style={styles.catLabel} numberOfLines={1}>{cat.label}</Text>
              )}
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.chartArea}>
          {chartData.length > 0 && (
            <>
              <PieChart data={chartData} size={140} />
              <View style={styles.chartLegend}>
                {chartData.map(d => (
                  <View key={d.label} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                    <Text style={styles.legendText}>
                      {d.label} {getPct(d.value, total)}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total {type === 'income' ? 'Ingresos' : 'Gastos'}:</Text>
        <Text style={[styles.totalValue, totalColor && { color: totalColor }]}>{fmt(total)}</Text>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  labelValueCol: {
    flex: 1,
    justifyContent: 'center',
    gap: 1,
  },
});
