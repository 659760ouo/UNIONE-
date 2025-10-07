import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import SwipeDot from '../assets/components/SwipeDot'; // 确保路径正确

const { width } = Dimensions.get('window');

// 引导页数据
export const onboardingData = [
  {
    id: 1,
    image: require('../assets/images/Goal.png'),
    title: 'Goal Management',
    description: 'Create and track your goals with an intuitive interface.',
  },
  {
    id: 2,
    image: require('../assets/images/Study.png'),
    title: 'Study Area',
    description: 'Embark your academic journey with motivation.',
  },
  {
    id: 3,
    image: require('../assets/images/More.png'),
    title: 'More extended features',
    description: 'Such as to do list , trip planning and financial management'
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const maxIndex = onboardingData.length - 1;
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  

  // 计算指示器位置
  const inputRange = onboardingData.map((_, index) => index * width);
  const outputRange = onboardingData.map((_, index) => index);
  const dotPosition = scrollX.interpolate({
    inputRange,
    outputRange,
  });

  // 处理滑动事件
  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const page = Math.round(contentOffset / width);
    
    // 同步更新当前页索引
    if (page !== currentIndex) {
      setCurrentIndex(page);
    }
  };

  // 处理点击"Next"
  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
      scrollToPage(currentIndex + 1);
    }
  };

  // 处理点击"Previous"
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollToPage(currentIndex - 1);
    }
  };

  // 处理点击"Get Started"
  const handleGetStarted = async() => {
    try{
      
      await AsyncStorage.setItem('hasCompleteOnboarding', 'true')
      navigation.navigate('Log');

    }catch(error){
      console.log('error when saving onboarding status', error)
    }
    navigation.navigate('Log');
  };

  // 滚动到指定页面
  const scrollToPage = (page) => {
    scrollX.setValue(page * width);
    scrollViewRef.current.scrollTo({
      x: page * width,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16} // 提高滚动事件频率，使动画更流畅
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={handleScroll} // 滚动结束后更新索引
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => (
          <View key={item.id} style={styles.page}>
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <SwipeDot
            key={index}
            isActive={currentIndex === index}
            position={dotPosition}
            index={index}
          />
        ))}
      </View>

      {/* 导航按钮 */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { opacity: currentIndex === 0 ? 0.5 : 1 }]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        {currentIndex < maxIndex ? (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: width,
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4361ee',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginHorizontal: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;