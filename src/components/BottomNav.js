import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import styles from '../styles/components/BottomNav.styles';

export default function BottomNav({ onSimulators, onWelcome, accentColor = COLORS.darkGreen }) {
  return (
    <View View style={styles.bottomNav}>
      <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: accentColor }]}
          onPress={onSimulators}
      >
          <Text style={styles.navText}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: accentColor }]}
          onPress={onWelcome}
      >
          <Text style={styles.navText}>Cursos y libros</Text>
      </TouchableOpacity>
    </View>
  );
}
