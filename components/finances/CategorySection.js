import { View, Text, TouchableOpacity } from 'react-native';
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
              <Text style={styles.catLabel}>{cat.label}</Text>
              {(monthData[type === 'income' ? 'income' : 'expenses']?.[cat.id] || 0) > 0 && (
                <Text style={styles.catValue}>
                  {fmt(monthData[type === 'income' ? 'income' : 'expenses'][cat.id])}
                </Text>
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
