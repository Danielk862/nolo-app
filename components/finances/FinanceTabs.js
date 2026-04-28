import { View, Text, TouchableOpacity } from 'react-native';
import { TABS } from '../../constants/tabsFinance';

export default function FinanceTabs({ activeTab, setActiveTab, styles, gastosStyle }) {
  return (
    <View style={styles.tabs}>
      {TABS.map(tab => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            activeTab === tab && styles.tabActive,
            gastosStyle && tab === 'Gastos' && activeTab !== tab && styles.tabGastos,
          ]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
