import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '../../../app/styles/Home_style';

const EmptyState = ({ message, buttonText, onPress }) => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>

    </View>
  );
};

export default EmptyState;
