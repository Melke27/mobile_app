import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AppIcon = ({ name, size = 18, color = '#21464f', style }) => {
  return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />;
};

export default AppIcon;
