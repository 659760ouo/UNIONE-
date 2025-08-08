import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView , Animated, Pressable} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { goalService } from './Goalservice';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}`;
};

const GoalStatistics = () => {
  const [stats, setStats] = useState([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [curView, setCurView] = useState('goal');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await goalService.getCompletedGoalsStats();
      const rawStats = Array.isArray(data?.stats) ? data.stats : [];
      
      const formattedStats = rawStats.map(item => ({
        value: isNaN(Number(item.count)) ? 0 : Number(item.count),
        label: formatDate(item.date)
      }));
      
      setStats(formattedStats);
      setTotalCompleted(Number(data?.totalCompleted) || 0);
      setError(null);
    } catch (err) {
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Text style={styles.loading}>Loading...</Text>;
  if (error) return <Text style={styles.error}>{error}</Text>;

  // Calculate maximum value in stats
  const maxValue = stats.length > 0 ? Math.max(...stats.map(item => item.value)) : 0;

  // Prepare chart data with conditional colors
  const goalData = stats.map(item => ({
    ...item,
    // Use special gradient for the bar with maximum value
    frontColor: item.value === maxValue ? '#ffd700' : '#defb00ce',
    gradientColor: item.value === maxValue ? '#ffA500' : '#40ff00d9',
  }));

  const taskData = tasks.map(item => ({
    ...item,
    // Use special gradient for the bar with maximum value
    frontColor: item.value === maxValue ? '#ffd700' : '#defb00ce',
    gradientColor: item.value === maxValue ? '#ffA500' : '#40ff00d9',
  }));
  
  const slide_ani = (condition) =>{
      const slideLeft = () => {
          
      }
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Goals (7 Days)</Text>
      {curView === 'goal' ?(
        <Text style={styles.total}>Total goal(s) completed: {totalCompleted}</Text>
      ):(

        <Text style={styles.total}>Total task(s) completed: {totalCompleted}</Text>
      )}

      <View style={styles.chartContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          style={styles.scrollView}
        >
        {curView === 'goal' ? (

          <BarChart
            data={goalData}  // Use the prepared data with conditional colors
            showYAxisIndices
            showXAxisIndices
            hideRules
            showVerticalLines
            verticalLinesColor={'white'}
            overflowTop={10}
            noOfSections={5}
            showGradient
            width={300}  
            height={150}
            barWidth={25}
            spacing={10}
            yAxisMinimum={1}
            yAxisMaximum={10}
            yAxisInterval={1}
            yAxisTextStyle={styles.smallAxisText}
            xAxisTextStyle={styles.smallAxisText}
            xAxisLabelWidth={40}
            barBorderTopLeftRadius={5}
            barBorderTopRightRadius={5}
            isAnimated={true}
            showLegend={false}
            showValuesAsTopLabel={true}
            opacity={0.5}
          />
        ):(
          <BarChart
           
          />
        )

      
      }
          
        </ScrollView>

        <View style={styles.switch_container}>
          <View style={[styles.pill, curView === 'goal' && styles.activeButton]}>
            <Pressable onPress={()=>setCurView('goal')}>

              <Text style={[styles.pilltxt, curView === 'goal' && styles.activetxt]}>Goals</Text>

            </Pressable>
          </View>


          <View style={[styles.pill, curView === 'tasks' && styles.activeButton]}>
            <Pressable onPress={()=>setCurView('tasks')}>

              <Text style={[styles.pilltxt, curView === 'tasks' && styles.activetxt]}>Tasks</Text>

            </Pressable>
          </View>

            

        </View>
      </View>
      
    </View>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    marginTop: 30
  },
  total: {
    fontSize: 18,
    marginBottom: 15,
    color: '#229954',
    

  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 35,
    padding: 10,
    shadowOpacity: 0.1,
    elevation: 2,
    marginBottom: 15,
    width: '90%',
    overflow: 'hidden',
    alignItems: 'center',
    height: 240
    
  },
  scrollView: {
    width: '100%'
  },
  smallAxisText: {
    fontSize: 10,
    color: '#666'
  },
  loading: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15
  },
  error: {
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 15
  },
  switch_container:{
    backgroundColor: '#eeeeeeff',
    flexDirection: 'row',
    padding: 6,
    width: 140,
    borderRadius: 6
    
    
  },
  pill :{
    alignItems: 'center',
    width: '48%',
    marginLeft: '1%',
    marginRight: '1%',
    borderRadius: 5,
    paddingTop: 1,
    paddingBottom: 1
    
  },
  activeButton: {
    backgroundColor: '#a8a8a8ff',
    borderRadius: 5,
    
  },
  activetxt: {
    color: 'white'
  }
});

export default GoalStatistics;