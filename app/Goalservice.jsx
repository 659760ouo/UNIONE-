import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { auth, db } from "./service/firebase";

/**
 * Get all goals for current user, ordered by creation time (newest first)
 * @returns {Promise<Array>} List of user's goals
 */
export const getGoals = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Please log in to view your goals");
  }

  try {
    // Query: User's goals sorted by creation time (newest first)
    const goalsQuery = query(
      collection(db, "goals"),
      where("userId", "==", user.uid), // Only current user's goals
      orderBy("createdAt", "desc") // "desc" = descending (latest first)
    );

    const snapshot = await getDocs(goalsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("getGoals error:", error);
    throw new Error("Failed to load goals. Please try again.");
  }
};

/**
 * Add a new goal with creation timestamp
 * @param {Object} goalData - Goal details (title, description, etc.)
 * @returns {Promise<string>} New goal ID
 */
export const addGoal = async (goalData) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Please log in to add a goal");
  }

  if (!goalData.title) { // No deadline required anymore
    throw new Error("Goal title is required");
  }

  try {
    // Add goal with auto-generated creation timestamp
    const docRef = await addDoc(collection(db, "goals"), {
      ...goalData,
      userId: user.uid,
      completed: false,
      createdAt: new Date() // Store exact creation time
    });

    return docRef.id;
  } catch (error) {
    console.error("addGoal error:", error);
    throw new Error("Failed to add goal. Please try again.");
  }
};

// Update and delete functions remain similar (no deadline references)
export const updateGoal = async (goalId, updates) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Please log in to update goals");
  }

  if (!goalId) {
    throw new Error("Goal ID is required");
  }

  try {
    const goalDoc = doc(db, "goals", goalId);
    const goalSnapshot = await getDoc(goalDoc);

    if (!goalSnapshot.exists() || goalSnapshot.data().userId !== user.uid) {
      throw new Error("You don't have permission to update this goal");
    }

    await updateDoc(goalDoc, updates);
  } catch (error) {
    console.error("updateGoal error:", error);
    throw new Error("Failed to update goal. Please try again.");
  }
};

export const deleteGoal = async (goalId) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Please log in to delete goals");
  }

  if (!goalId) {
    throw new Error("Goal ID is required");
  }

  try {
    const goalDoc = doc(db, "goals", goalId);
    const goalSnapshot = await getDoc(goalDoc);

    if (!goalSnapshot.exists() || goalSnapshot.data().userId !== user.uid) {
      throw new Error("You don't have permission to delete this goal");
    }

    await deleteDoc(goalDoc);
  } catch (error) {
    console.error("deleteGoal error:", error);
    throw new Error("Failed to delete goal. Please try again.");
  }
};
