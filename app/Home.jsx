import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { deleteGoal, getGoals, updateGoal } from "./Goalservice";

const HomeScreen = () => {
  // State management
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Load goals from Firestore
  const loadGoals = async () => {
    setError(null);
    try {
      const userGoals = await getGoals();
      setGoals(userGoals);
    } catch (err) {
      setError(err.message);
      Alert.alert("Error Loading Goals", err.message);
      console.error("Goal loading error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load and refresh on navigation focus
  useEffect(() => {
    loadGoals();
    const unsubscribe = navigation.addListener("focus", loadGoals);
    return unsubscribe; // Cleanup listener
  }, [navigation]);

  // Pull-to-refresh handler
  const handleRefresh = () => {
    setRefreshing(true);
    loadGoals();
  };

  // Handle goal deletion with confirmation
  const handleDeleteGoal = async (goalId) => {
    Alert.alert(
      "Delete Goal",
      "Are you sure you want to delete this goal? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGoal(goalId);
              // Update local state immediately for better UX
              setGoals(goals.filter(goal => goal.id !== goalId));
              Alert.alert("Success", "Goal deleted successfully");
            } catch (err) {
              Alert.alert("Deletion Failed", err.message);
              console.error("Delete error:", err);
            }
          }
        }
      ]
    );
  };

  // Handle goal completion toggle
  const handleToggleCompletion = async (goalId, currentStatus) => {
    try {
      // Update Firestore
      await updateGoal(goalId, { completed: !currentStatus });
      // Update local state immediately
      setGoals(goals.map(goal => 
        goal.id === goalId ? { ...goal, completed: !currentStatus } : goal
      ));
    } catch (err) {
      Alert.alert("Update Failed", err.message);
      console.error("Toggle completion error:", err);
    }
  };

  // Navigate to add goal screen
  const handleAddGoal = () => {
    navigation.navigate("AddGoal");
  };

  // Navigate to edit goal screen
  const handleEditGoal = (goal) => {
    navigation.navigate("EditGoal", { goal });
  };

  // Loading state UI
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading your goals...</Text>
      </View>
    );
  }

  // Error state UI
  if (error && goals.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#f44336" />
        <Text style={styles.errorText}>Something went wrong</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={loadGoals}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty state UI
  if (goals.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Goals</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddGoal}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="clipboard-outline" size={64} color="#cccccc" />
          <Text style={styles.emptyTitle}>No goals yet!</Text>
          <Text style={styles.emptySubtitle}>Start by adding your first goal</Text>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAddGoal}
          >
            <Text style={styles.primaryButtonText}>Add New Goal</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Main UI with goals list
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Goals</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddGoal}
          accessibilityLabel="Add new goal"
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            {/* Completion checkbox */}
            <TouchableOpacity
              style={[styles.checkbox, item.completed && styles.checkboxChecked]}
              onPress={() => handleToggleCompletion(item.id, item.completed)}
              accessibilityLabel={item.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {item.completed && (
                <Ionicons name="checkmark" size={20} color="white" />
              )}
            </TouchableOpacity>

            {/* Goal details */}
            <View style={styles.goalDetails}>
              <Text 
                style={[styles.goalTitle, item.completed && styles.completedGoalTitle]}
              >
                {item.title}
              </Text>
              
              <View style={styles.goalMeta}>
                <Text style={styles.creationDate}>
                  Created: {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
                
                {item.description && (
                  <Text style={styles.goalDescription}>
                    {item.description}
                  </Text>
                )}
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.goalActions}>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => handleEditGoal(item)}
                accessibilityLabel="Edit goal"
              >
                <Ionicons name="pencil" size={20} color="#2196F3" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteGoal(item.id)}
                accessibilityLabel="Delete goal"
              >
                <Ionicons name="trash" size={20} color="#f44336" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#4CAF50"]}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 14,
    color: "#666666",
    marginBottom: 24,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    textAlign: "center",
  },
  emptyTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "500",
    color: "#333333",
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#666666",
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  listContent: {
    paddingVertical: 16,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
  },
  goalDetails: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  completedGoalTitle: {
    textDecorationLine: "line-through",
    color: "#888888",
  },
  goalMeta: {
    marginTop: 4,
  },
  creationDate: {
    fontSize: 12,
    color: "#666666",
  },
  goalDescription: {
    fontSize: 14,
    color: "#555555",
    marginTop: 2,
    fontStyle: "italic",
  },
  goalActions: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
});

export default HomeScreen;
