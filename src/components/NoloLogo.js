import { View, Text } from 'react-native';
import { COLORS } from '../constants/theme';
import styles from '../styles/components/NoloLogo.styles';

export default function NoloLogo({size = 'md', simulator = false }) {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 48 : size === 'xs' ? 22 : 36;
  const fontSize = size === 'sm' ? 22 : size === 'lg' ? 38 : size === 'xs' ? 16 : 28;
  const textSize = simulator ? 12 : 14;
  const color = COLORS.darkGray;

  return(
    <View style={styles.logoArea}>
      <View style={styles.container}>
        <View style={[styles.iconCircle, { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }]}>
          <Text style={[styles.dollar, { fontSize: iconSize * 0.55 }]}>$</Text>
        </View>
        <Text style={[styles.text, { fontSize, color }]}>Nolo</Text>
      </View>
      <Text style={[styles.byline, { fontSize: textSize }]}>by la Peliroja Financiera</Text>
    </View>
  )
}
