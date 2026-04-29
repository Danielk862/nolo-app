import { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const ITEM_HEIGHT = 44;
const START_YEAR = 2026;
const YEARS = Array.from({ length: 15 }, (_, i) => START_YEAR + i);

export default function YearSelector({ selectedYear, setSelectedYear, accentColor = '#1E7A3E' }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    const index = YEARS.indexOf(selectedYear);
    if (index < 0) return;
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const onMomentumScrollEnd = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, YEARS.length - 1));
    setSelectedYear(YEARS[clamped]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        nestedScrollEnabled
        scrollEventThrottle={16}
        style={{ height: ITEM_HEIGHT * 3 }}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
      >
        {YEARS.map((year) => (
          <View key={year} style={styles.item}>
            <Text
              style={[
                styles.yearText,
                year === selectedYear && { color: accentColor, fontWeight: '700', fontSize: 20 },
              ]}
            >
              {year}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={[styles.line, styles.lineTop, { borderColor: accentColor }]} pointerEvents="none" />
      <View style={[styles.line, styles.lineBottom, { borderColor: accentColor }]} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * 3,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearText: {
    fontSize: 16,
    color: '#999',
  },
  line: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderTopWidth: 1.5,
  },
  lineTop: {
    top: ITEM_HEIGHT,
  },
  lineBottom: {
    top: ITEM_HEIGHT * 2,
  },
});
