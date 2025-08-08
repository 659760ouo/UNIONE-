import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { styles } from '../../../app/styles/Main_style';

const FloatingButtons = ({ onAdd, onRemove, disabled }) => {
  const add_icon = require('../../images/add.png');
  const remove_icon = require('../../images/remove.png');
  
  return (
    <View style={styles.floatingContainer}>
      <Pressable 
        onPress={onRemove} 
        style={[styles.floatingButton, { backgroundColor: '#EF4444' }, disabled && { opacity: 0.5 }]}
        disabled={disabled}
      >
        <Image source={remove_icon} style={styles.floatingIcon} />
      </Pressable>
      <Pressable 
        onPress={onAdd} 
        style={[styles.floatingButton, { backgroundColor: '#22C55E' }]}
      >
        <Image source={add_icon} style={styles.floatingIcon} />
      </Pressable>
    </View>
  );
};

export default FloatingButtons;
