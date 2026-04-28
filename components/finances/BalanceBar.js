import { View, Text, ActivityIndicator } from 'react-native';

export default function BalanceBar({ balance, selectedMonth, selectedYear, loading, fmt, accentColor, styles }) {
  return (
    <View style={styles.balanceBar}>
      <Text style={styles.balanceText}>Saldo: {fmt(balance)}</Text>
      <View style={styles.balanceRight}>
        <Text style={styles.periodText}>{selectedMonth} {selectedYear}</Text>
        {loading && <ActivityIndicator size="small" color={accentColor} style={{ marginLeft: 6 }} />}
      </View>
    </View>
  );
}
