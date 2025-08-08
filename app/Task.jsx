import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, Feather } from '@expo/vector-icons';

const TodoList = () => {
  // State management
  const [ongoingTasks, setOngoingTasks] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [activeView, setActiveView] = useState('ongoing');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // Simplified sort state
  const taskAnimations = useRef({ ongoing: [], finished: [] }).current;
  const { width } = Dimensions.get('window');

  // Load sample tasks
  useEffect(() => {
    const sampleOngoing = [
      { id: '1', title: 'Complete project proposal', description: 'Finish draft by EOD', isFinished: false },
      { id: '2', title: 'Buy groceries', description: 'Milk, eggs, vegetables', isFinished: false }
    ];
    
    const sampleFinished = [
      { id: '3', title: 'Read book chapter', description: 'Chapter 5 on productivity', isFinished: true }
    ];

    setOngoingTasks(sampleOngoing);
    setFinishedTasks(sampleFinished);
  }, []);

  // Initialize animations correctly
  useEffect(() => {
    ongoingTasks.forEach((_, index) => {
      if (!taskAnimations.ongoing[index] || !(taskAnimations.ongoing[index] instanceof Animated.Value)) {
        taskAnimations.ongoing[index] = new Animated.Value(0);
      }
      
      Animated.timing(taskAnimations.ongoing[index], {
        toValue: 1,
        duration: 500 + index * 100,
        useNativeDriver: true,
      }).start();
    });

    finishedTasks.forEach((_, index) => {
      if (!taskAnimations.finished[index] || !(taskAnimations.finished[index] instanceof Animated.Value)) {
        taskAnimations.finished[index] = new Animated.Value(0);
      }
      
      Animated.timing(taskAnimations.finished[index], {
        toValue: 1,
        duration: 500 + index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, [ongoingTasks, finishedTasks]);

  // Sort tasks - simplified sorting logic
  const sortedTasks = useMemo(() => {
    const currentTasks = activeView === 'ongoing' ? ongoingTasks : finishedTasks;
    const sorted = [...currentTasks];
    
    // Sort by ID (timestamp)
    sorted.sort((a, b) => new Date(a.id) - new Date(b.id));
    
    // Reverse if descending order
    if (sortOrder === 'desc') {
      sorted.reverse();
    }
    
    return sorted;
  }, [ongoingTasks, finishedTasks, activeView, sortOrder]);

  // Task handlers
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      isFinished: false
    };

    setOngoingTasks(prev => [newTask, ...prev]);
    resetAddModal();
  };

  const resetAddModal = () => {
    setShowAddModal(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const toggleTaskStatus = (task) => {
    if (task.isFinished) {
      setFinishedTasks(prev => prev.filter(t => t.id !== task.id));
      setOngoingTasks(prev => [...prev, { ...task, isFinished: false }]);
    } else {
      setOngoingTasks(prev => prev.filter(t => t.id !== task.id));
      setFinishedTasks(prev => [...prev, { ...task, isFinished: true }]);
    }
  };

  const deleteTask = (task) => {
    if (task.isFinished) {
      setFinishedTasks(prev => prev.filter(t => t.id !== task.id));
    } else {
      setOngoingTasks(prev => prev.filter(t => t.id !== task.id));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <View style={styles.viewToggle}>
          <Pressable
            style={[styles.viewButton, activeView === 'ongoing' && styles.activeViewButton]}
            onPress={() => setActiveView('ongoing')}
          >
            <Text style={[styles.viewButtonText, activeView === 'ongoing' && styles.activeViewText]}>
              Ongoing
            </Text>
          </Pressable>
          <Pressable
            style={[styles.viewButton, activeView === 'finished' && styles.activeViewButton]}
            onPress={() => setActiveView('finished')}
          >
            <Text style={[styles.viewButtonText, activeView === 'finished' && styles.activeViewText]}>
              Finished
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Fixed Sort Controls - simplified and reliable */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {/* Picker with explicit dimensions and background */}
        <Picker
          selectedValue={sortOrder}
          style={styles.picker}
          onValueChange={(value) => setSortOrder(value)}
          mode="dropdown" // Ensures consistent appearance
        >
          <Picker.Item label="Newest First" value="asc" />
          <Picker.Item label="Oldest First" value="desc" />
        </Picker>
      </View>

      {/* Task list */}
      <ScrollView style={styles.taskList}>
        {sortedTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {activeView === 'ongoing' ? 'No ongoing tasks yet!' : 'No finished tasks yet!'}
            </Text>
            {activeView === 'finished' && (
              <Pressable
                style={styles.emptyActionButton}
                onPress={() => setActiveView('ongoing')}
              >
                <Text style={styles.emptyActionText}>View Ongoing Tasks</Text>
              </Pressable>
            )}
          </View>
        ) : (
          sortedTasks.map((task, index) => {
            const animation = activeView === 'ongoing'
              ? taskAnimations.ongoing[index]
              : taskAnimations.finished[index];

            const translateX = animation instanceof Animated.Value 
              ? animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width, 0]
                })
              : 0;

            return (
              <Animated.View
                key={task.id}
                style={[
                  styles.taskContainer,
                  {
                    opacity: animation,
                    transform: [{ translateX }]
                  }
                ]}
              >
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, task.isFinished && styles.finishedText]}>
                    {task.title}
                  </Text>
                  
                  {task.description && (
                    <Text style={[styles.taskDescription, task.isFinished && styles.finishedText]}>
                      {task.description}
                    </Text>
                  )}
                </View>

                <View style={styles.taskActions}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => toggleTaskStatus(task)}
                  >
                    <Ionicons
                      name={task.isFinished ? "arrow-undo-outline" : "checkmark-circle-outline"}
                      size={22}
                      color={task.isFinished ? "#666" : "#4CAF50"}
                    />
                  </Pressable>
                  
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => deleteTask(task)}
                  >
                    <Feather name="trash-2" size={20} color="#e74c3c" />
                  </Pressable>
                </View>
              </Animated.View>
            );
          })
        )}
      </ScrollView>

      {/* Add task button */}
      <Pressable
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </Pressable>

      {/* Add task modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Task title"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={newTaskDescription}
              onChangeText={setNewTaskDescription}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={resetAddModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={styles.saveButton}
                onPress={handleAddTask}
              >
                <Text style={styles.saveButtonText}>Save Task</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 10,
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  activeViewButton: {
    backgroundColor: '#2196F3',
  },
  viewButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  activeViewText: {
    color: 'white',
  },
  // Fixed sort container with proper layout
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 60, // Prevents collapsing
  },
  sortLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
    width: 70, // Fixed width to prevent layout shifts,

  },
  // Fixed picker styling
  picker: {
    flex: 1, // Takes remaining space
    height: 50, // Explicit height
    color: '#333',
    backgroundColor: 'white', // Visible background
  },
  taskList: {
    flex: 1,
    padding: 15,
  },
  taskContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  taskActions: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    padding: 5,
  },
  finishedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyActionButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  emptyActionText: {
    color: 'white',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default TodoList;
