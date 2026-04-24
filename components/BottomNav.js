import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function BottomNav({ onInicio, accentColor = COLORS.darkGreen }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: accentColor }]}
        onPress={onInicio}
      >
        <Text style={styles.btnText}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, { backgroundColor: accentColor }]}>
        <Text style={styles.btnText}>Cursos y libros</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 13,
  },
});
