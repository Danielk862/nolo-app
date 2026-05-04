import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import styles from '../styles/components/MonthSelector.styles';

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

export default function MonthSelector({ selected, onSelect, accentColor = COLORS.darkGreen, activeBg }) {
  const activeBgColor = activeBg || accentColor;
  return (
    <View>
      <View style={styles.monthGrid}>
        {MONTHS.map((m) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.monthBtn,
              {
                backgroundColor: selected === m ? activeBgColor : COLORS.primaryGreen,
              },
            ]}
            onPress={() => onSelect(m)}
          >
            <Text style={[styles.monthText, { color: selected === m ? COLORS.white : COLORS.darkGray }]}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
