import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function slicePath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} Z`;
}

export default function PieChart({ data, size = 160, innerRadius = 0 }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const total = data.reduce((s, d) => s + d.value, 0);

  let cumAngle = 0;
  const slices = data.map((d) => {
    const angle = (d.value / total) * 360;
    const path = slicePath(cx, cy, r, cumAngle, cumAngle + angle);
    cumAngle += angle;
    return { ...d, path };
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <G>
          {slices.map((s, i) => (
            <Path key={i} d={s.path} fill={s.color} stroke="white" strokeWidth={1.5} />
          ))}
          {innerRadius > 0 && (
            <Circle cx={cx} cy={cy} r={innerRadius} fill="white" />
          )}
        </G>
      </Svg>
    </View>
  );
}
