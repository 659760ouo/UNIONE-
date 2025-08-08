import React, { useState } from 'react';
import { View, Animated, Pressable, Text } from 'react-native';
import { styles } from '../../../app/styles/Main_style';
import { Entypo } from '@expo/vector-icons';

// import GoalCard from './GoalCard';


// Helper functions
const formatDate = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return dateObj.toLocaleDateString('en-US', options);
};



const calculateDaysDifference = (start, end) => {
  if (!start || !end) return 0;
  const s = new Date(start)
  const e = new Date(end)
  const msPerDay = 1000 * 60 * 60 * 24;
  const startMs = s.getTime();
  const endMs = e.getTime();
  return Math.round(Math.abs(endMs - startMs) / msPerDay);
};

const renderStatusPill = (status) => {
  const statusColor = {
    "conquering": '#FF9500',
    "finished": '#22C55E',
    "new": '#3B82F6'
  };
  
  const statusText = {
    "conquering": "Ongoing",
    "finished": "Finished",
    "new": "New"
  };

  return (
    <View style={[styles.statusPill, { backgroundColor: statusColor[status] }]}>
      <Text style={styles.statusPillText}>{statusText[status]}</Text>
    </View>
  );
};

const GoalList = ({ goals, animations, type, onRemove, onStatusChange , isFinished}) => {
  const { width } = require('react-native').Dimensions.get('window');
  

 
  return (
    
    <View style={styles.goalListContainer}>
      {goals.map((goal, index) => {
        if (!animations[index]) {
          animations[index] = new Animated.Value(0);
        }
        
        const inputRange = [0, 1];
        const outputRange = [width, 0];
        
        return (
          <Animated.View
            key={goal.id}
            style={[
              styles.goalCard,
              {
                transform: [{ 
                  translateX: animations[index].interpolate({ 
                    inputRange, 
                    outputRange 
                  }) 
                }],
                opacity: animations[index],
              },
            ]}
          >
            {/* Checkbox */}
            <Pressable 
              style={styles.checkbox}
              onPress={() => onStatusChange(goal.id)}
            >
              {type === 'finished' ? (
                <View style={styles.checkedCheckbox} />
              ) : (
                <View style={styles.emptyCheckbox} />
              )}
            </Pressable>
            
            {/* Remove button */}
            <Pressable 
              style={styles.removeButton}
              onPress={() => onRemove(goal.id)}
            >
              <Entypo name="minus" size={18} color="#EF4444" />
            </Pressable>
            
            {renderStatusPill(goal.status)}
            
            <Text style={[
              styles.goalTitle,
              type === 'finished' && styles.finishedGoalText
            ]}>
              {goal.title}
            </Text>
            
            <Text style={[
              styles.goalDescription,
              type === 'finished' && styles.finishedGoalText
            ]}>
              {goal.description}
            </Text>
            
            <View style={styles.goalMetaContainer}>
              {type === 'finished' ? (
                <>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Finished on:</Text>
                    <Text style={styles.metaValue}>{formatDate(goal.finishedDate)}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Days spent:</Text>
                    <Text style={styles.metaValue}>
                      {calculateDaysDifference(goal.startDate, goal.finishedDate)} 
                      {calculateDaysDifference(goal.startDate, goal.finishedDate) === 1 ? ' day' : ' days'}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Target date:</Text>
                    <Text style={styles.metaValue}>{formatDate(goal.targetDate)}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Updates:</Text>
                    <Text style={styles.metaValue}>{goal.updates}</Text>
                  </View>
                </>
              )}
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
};

export default GoalList;
