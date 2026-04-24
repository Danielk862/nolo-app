import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

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

const styles = StyleSheet.create({
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  monthBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    minWidth: 90,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
