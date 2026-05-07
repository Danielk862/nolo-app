import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import styles from '../styles/components/BottomNav.styles';
import { ROUTES } from '../constants/routes';

export default function BottomNav({ navigation, accentColor = false }) {
  const color = accentColor ? COLORS.primaryYellow : COLORS.darkGreen;
  
  return (
    <View View style={styles.bottomNav}>
      <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: color }]}
          onPress={() => navigation.navigate(ROUTES.SIMULATORS)} 
      >
          <Text style={styles.navText}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: color }]}
          onPress={() => navigation.navigate(ROUTES.WELCOME)} 
      >
          <Text style={styles.navText}>Cursos y libros</Text>
      </TouchableOpacity>
    </View>
  );
}
