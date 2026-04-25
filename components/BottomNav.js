import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import styles from '../styles/components/BottomNav.styles';

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
