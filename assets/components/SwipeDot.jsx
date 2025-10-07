// components/SwipeDot.js
import { Animated, StyleSheet, View } from 'react-native';
import { onboardingData } from '../../app/OnBoardingScreen';


function SwipeDot({ isActive, position, index }) {
  const dotWidth = isActive ? 20 : 8;
  const dotColor = isActive ? '#4361ee' : '#cccccc';

  // Generate the correct outputRange based on the index
  const outputRange = onboardingData.map((_, idx) => idx * 28);

  // Animated style for active dot position
  const activeDotStyle = {
    transform: [
      {
        translateX: position.interpolate({
          inputRange: onboardingData.map((_, idx) => idx),
          outputRange,
        }),
      },
    ],
  };

  return (
    <View style={{ marginHorizontal: 5 }}>
      <Animated.View style={[styles.dot, { width: dotWidth, backgroundColor: dotColor }]} />
      {isActive && <Animated.View style={[styles.activeDot, activeDotStyle]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cccccc',
    marginVertical: 5,
  },
  activeDot: {
    position: 'absolute',
    top: -12,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4361ee',
  },
});

export default SwipeDot;