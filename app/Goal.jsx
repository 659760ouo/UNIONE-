import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Modal,
  Platform,
  Animated
} from 'react-native';
import { styles } from './styles/Main_style';

// Import modular components
import GoalHeader from '../assets/components/goal/GoalHeader';
import GoalList from '../assets/components/goal/GoalList';
import FloatingButtons from '../assets/components/goal/FloatingButtons';
import NewGoalModal from '../assets/components/goal/NewGoalModal';
import EmptyState from '../assets/components/goal/EmptyState';
import { goalService } from './Goalservice';
import { Picker } from '@react-native-picker/picker';

// Main Home Screen
const GoalScreen = () => {
  // State management
  const [ongoingGoals, setOngoingGoals] = useState([]);
  const [finishedGoals, setFinishedGoals] = useState([]);
  const [activeView, setActiveView] = useState('ongoing');
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const goalAnimations = useRef({ ongoing: [], finished: [] }).current;

  // Removed unused state variables: ongoing_order, finished_order, picker_order
  const [OngoingsortConfig, setOngoingSortConfig] = useState({
    order: 'asc'     
  });
  const [FinishedsortConfig, setFinishedSortConfig] = useState({
    order: 'asc'       
  });

  const handleSortChange = (itemValue) => {
    const order = itemValue;
    activeView === 'ongoing'
      ? setOngoingSortConfig({ order })
      : setFinishedSortConfig({ order });
  };

  // Fixed sorting logic - now triggers immediately on any selection
  const sortedGoals = useMemo(() => {
    const currentGoals = activeView === 'ongoing' ? ongoingGoals : finishedGoals;
    const sortConfig = activeView === 'ongoing' ? OngoingsortConfig : FinishedsortConfig;

    // Create copy to avoid mutation
    const sorted = [...currentGoals];
    
    // Reverse if descending order is selected
    if (sortConfig.order === 'desc') {
      sorted.reverse();
    }

    return sorted;
  }, [ongoingGoals, finishedGoals, OngoingsortConfig, FinishedsortConfig, activeView]);

  useEffect(() => {
    const loadOnGoals = async () => {
      try {
        const goals = await goalService.getGoals();
        
        const goalsArray = Array.isArray(goals.data) ? goals.data : [goals.data];
        console.log(goals.data);

        const parsedGoals = goalsArray.map(goal => ({
          ...goal,
          startDate: goal.startDate ? new Date(goal.startDate) : null,
          targetDate: goal.targetDate ? new Date(goal.targetDate) : null,
          finishedDate: goal.finishedDate ? new Date(goal.finishedDate) : null
        }));

        // Separate goals into ongoing and finished
        const ongoing = parsedGoals.filter(g => g.status !== 'finished');
        const finished = parsedGoals.filter(g => g.status === 'finished');
        
        // Fixed: Directly set state with new arrays (no incorrect spread)
        setOngoingGoals(ongoing);
        setFinishedGoals(finished);
        
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    };

    loadOnGoals();
  }, []);

  // Update newest goal status
  useEffect(() => {
    if (ongoingGoals.length === 0) return;
    
    setOngoingGoals(prev => prev.map((goal, index) => {
      if (index === prev.length - 1) return { ...goal, status: 'new' };
      if (goal.status === 'new' && index !== prev.length - 1) {
        return { ...goal, status: 'conquering' };
      }
      return goal; 
    }));
  }, [ongoingGoals.length]);

  // Initialize animations
  useEffect(() => {
    // Initialize ongoing goal animations
    ongoingGoals.forEach((_, index) => {
      if (!goalAnimations.ongoing[index]) {
        goalAnimations.ongoing[index] = new Animated.Value(0);
      }
      Animated.timing(goalAnimations.ongoing[index], {
          toValue: 1,
          duration: 500 + index * 100,
          useNativeDriver: true,
        }).start();
      }
    );

    // Initialize finished goal animations
    finishedGoals.forEach((_, index) => {
      if (!goalAnimations.finished[index]) {
        goalAnimations.finished[index] = new Animated.Value(0);
        Animated.timing(goalAnimations.finished[index], {
          toValue: 1,
          duration: 500 + index * 100,
          useNativeDriver: true,
        }).start();
      }
    });
  }, [ongoingGoals, finishedGoals]);

  // Handlers passed as props to components
  const handleAddGoal = () => {
    setShowNewGoalModal(true);
    setSelectedDate(new Date());
  };

  const removeOngoingGoal = async (goalId) => {
    await goalService.deleteGoal(goalId);
    setOngoingGoals(ongoingGoals.filter(goal => goal.id !== goalId)); 
  };

  const removeFinishedGoal = async (goalId) => {
    await goalService.deleteGoal(goalId);
    setFinishedGoals(finishedGoals.filter(goal => goal.id !== goalId)); 
  };

  const markAsFinished = async (goalId) => {
    const goalToFinish = ongoingGoals.find(goal => goal.id === goalId);
    if (!goalToFinish) return;
    
    const finishedDate = new Date().toISOString();

    const finishGoal = {
      ...goalToFinish,
      status: 'finished',
      finishedDate: finishedDate
    };
    
    try {
      await goalService.updateGoal(goalId, {
        status: 'finished',
        finishedDate: finishedDate
      });
    } catch (err) {
      console.log('Error updating goal status to finished', err);
    }

    setOngoingGoals(ongoingGoals.filter(goal => goal.id !== goalId));
    setFinishedGoals([...finishedGoals, finishGoal]);
  };

  const markAsOngoing = async (goalId) => {
    const goalToReactivate = finishedGoals.find(goal => goal.id === goalId);
    if (!goalToReactivate) return;

    try {
      await goalService.updateGoal(goalId, {
        status: 'conquering',
        finishedDate: null
      });
    } catch (err) {
      console.log('Error updating the status to ongoing');
    }

    setFinishedGoals(finishedGoals.filter(goal => goal.id !== goalId));
    setOngoingGoals([...ongoingGoals, {
      ...goalToReactivate,
      status: 'conquering',
      finishedDate: null
    }]);
  };

  const addNewGoalWithDate = async () => {
    if (newGoalTitle.trim() === '') return;

    const currentLastGoal = ongoingGoals[ongoingGoals.length - 1];

    const newGoal = {
      id: Date.now(),
      title: newGoalTitle,
      description: newGoalDescription,
      status: "new",
      updates: 0,
      targetDate: selectedDate.toISOString(),
      startDate: new Date().toISOString()
    };
    
    try {
      await goalService.addGoal(newGoal);
      setOngoingGoals([...ongoingGoals, {...newGoal}]);
      setShowNewGoalModal(false);
      setNewGoalTitle('');
      setNewGoalDescription('');

      if (currentLastGoal) {
        await goalService.updateGoal(
          currentLastGoal.id, {
            status: 'conquering',
          }
        );
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
          <GoalHeader 
            title="Goals" 
            subtitle={activeView === 'ongoing' ? 'Track your progress' : 'Celebrate achievements'}
            activeView={activeView}
            setActiveView={setActiveView}
            showToggle={true}
          />

        <ScrollView style={styles.scrolling} contentContainerStyle={styles.scrollContent}>
          <View style={styles.orderPick_container}>
              <Picker
                // Fixed: Properly reference FinishedsortConfig.order and use consistent values
                selectedValue={activeView === 'ongoing'
                  ? OngoingsortConfig.order
                  : FinishedsortConfig.order}
                style={styles.sortPicker}
                onValueChange={handleSortChange}
                mode='dropdown'
              >
                <Picker.Item 
                  label="From oldest to latest" 
                  value="asc" 
                />
                <Picker.Item 
                  label="From latest to oldest" 
                  value="desc" 
                />
              </Picker>
          </View>

          {activeView === 'ongoing' ? (
            ongoingGoals.length === 0 ? (
              <EmptyState 
                message="No ongoing goals yet! Click the button below to add your goal!" 
                color='black'
              />
            ) : (
              <GoalList 
                goals={sortedGoals}
                animations={goalAnimations.ongoing}
                type="ongoing"
                onRemove={removeOngoingGoal}
                onStatusChange={markAsFinished}
                isFinished={false}
              />
            )
          ) : (
            finishedGoals.length === 0 ? (
              <EmptyState 
                message="No finished goals yet!" 
                buttonText="View Ongoing Goals"
                onPress={() => setActiveView('ongoing')}
              />
            ) : (
              <GoalList 
                goals={sortedGoals}
                animations={goalAnimations.finished}
                type="finished"
                onRemove={removeFinishedGoal}
                onStatusChange={markAsOngoing}
                isFinished={true}
              />
            )
          )}
        </ScrollView>
      </View>

      {activeView === 'ongoing' && (
        <FloatingButtons 
          onAdd={handleAddGoal}
          onRemove={ongoingGoals.length > 0 ? () => removeOngoingGoal(ongoingGoals[ongoingGoals.length - 1].id) : null}
          disabled={ongoingGoals.length === 0}
        />
      )}

      <NewGoalModal 
        visible={showNewGoalModal}
        onClose={() => setShowNewGoalModal(false)}
        title={newGoalTitle}
        setTitle={setNewGoalTitle}
        description={newGoalDescription}
        setDescription={setNewGoalDescription}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        onConfirm={addNewGoalWithDate}
      />
    </SafeAreaView>
  );
};

export default GoalScreen;