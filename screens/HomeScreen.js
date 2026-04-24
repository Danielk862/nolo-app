import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import NoloLogo from '../components/NoloLogo';

const MODULE_CARDS = [
  {
    id: 'personal',
    emoji: '💰',
    label: 'Finanzas Personales',
    route: 'FinanzasPersonales',
    bg: '#E8F8D0',
    accent: COLORS.darkGreen,
  },
  {
    id: 'pareja',
    emoji: '💑',
    label: 'Finanzas en pareja',
    route: 'FinanzasPareja',
    bg: '#FFF0C8',
    accent: COLORS.primaryYellow,
  },
  {
    id: 'negocio',
    emoji: '🏢',
    label: 'Mi negocio',
    route: 'Simuladores',
    bg: '#E8E8F8',
    accent: '#5A5ABB',
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        {MODULE_CARDS.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, { backgroundColor: card.bg, borderColor: card.accent }]}
            onPress={() => navigation.navigate(card.route)}
            activeOpacity={0.85}
          >
            <Text style={styles.emoji}>{card.emoji}</Text>
            <Text style={[styles.label, { color: card.accent }]}>{card.label}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.logoContainer}>
          <NoloLogo size="md" color={COLORS.darkGray} />
          <Text style={styles.byline}>by la Peliroja Financiera</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreen,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    gap: SPACING.xl,
  },
  card: {
    width: '100%',
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  emoji: {
    fontSize: 52,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },
  byline: {
    color: COLORS.gray,
    fontSize: 14,
  },
});
