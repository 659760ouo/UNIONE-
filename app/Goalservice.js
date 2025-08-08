import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

const API_URL = 'http://192.168.5.4:3000/api';


// Get auth token from storage (implement your storage solution)
const getToken = async () => {
  // Example using AsyncStorage
  try{

    const token = await AsyncStorage.getItem('auth_token');
    if (token){
      console.log(
        'getToken method pass'
      )
    }
    return token

  }catch(err){

    console.log('Failed to catch token in getToken method')
  }
};

export const goalService = {
  // Get user's goals list
  async getGoals() {
    const token = await getToken();
   try{
      const response = await axios.get(`${API_URL}/goals`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' }
      });

      console.log('getGoal passed')
      return response.data;
   }catch(err){
    console.log(
      'Error getting Goals:', err
    )
   }
  },

  // Add new goal
  async addGoal(goal) {
    const token = await getToken();
    try{
      const response = await axios.post(`${API_URL}/goals`,  goal ,{
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
      
      });
      console.log('addGoal passed')
      return response.message;
    }catch(err){
      console.log('Error adding goal:', err)
    }
  },

  // Update goal status
  async updateGoal(id, updates) {
    const token = await getToken();
    if (!token) console.log('Failed to catch token in updateGoal')
    
    try{
      const response = await axios.patch(`${API_URL}/goals/${id}`, updates, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      console.log('updateGoal passed', response)
      return response.data.message;
      
    }catch(err){
      console.log('Error updating status of goal:', err)
    }
  },

  // Delete goal
  async deleteGoal(id) {
    const token = await getToken();
    console.log('delete goal:', id)
    try{
      const response = await axios.delete(`${API_URL}/goals/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` , 'Content-Type': 'application/json'}
      });
      console.log('deleteGoal passed')
      return response

    }catch(err){
      console.log('Error delete goal')
    }
  },


  // Add this to the goalService object in Goalservice.js
  async getCompletedGoalsStats() {
    const token = await getToken();
    try {
      const response = await axios.get(`${API_URL}/goals/stats/completed`, {
        headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
        }
      });
      console.log('getCompletedGoalsStats passed');
      return response.data;
    }catch (err) {
      console.log('Error getting completed goals stats:', err);
      throw err; // Re-throw to handle in component
    }
  }



};