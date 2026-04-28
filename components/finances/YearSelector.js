import { View, Text, TouchableOpacity } from 'react-native';

export default function YearSelector({ selectedYear, setSelectedYear, styles }) {
  return (
    <View style={styles.yearSelector}>
      {[selectedYear + 1, selectedYear, selectedYear - 1].map(y => (
        <TouchableOpacity key={y} onPress={() => setSelectedYear(y)}>
          <Text style={[styles.yearText, y === selectedYear && styles.yearActive]}>
            {y}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
