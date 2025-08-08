import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';
import { styles as mainStyles } from './styles/Main_style';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this

// Import components
import GoalHeader from '../assets/components/goal/GoalHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuScreen = ({ navigation }) => {
  // State for user info
  const [username, setUser] = useState('');
  const [email, setEmail] = useState('');
  
  // State for modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('username'); // 'username' or 'password'
  const [newValue, setNewValue] = useState('');
  const [confirmValue, setConfirmValue] = useState('');

  // Fetch user data
  const get_user = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('un');
      const storedEmail = await AsyncStorage.getItem('em');
      setUser(storedUser || '');
      setEmail(storedEmail || '');
    } catch (error) {
      console.log('Failed to fetch user info in menu:', error);
    }
  };

  useEffect(() => {
    get_user();
  }, []);


  const clearAll = async () =>{
    await AsyncStorage.removeItem('auth_token')
    await AsyncStorage.removeItem('em')
    await AsyncStorage.removeItem('un')
    navigation.navigate('Log')
    
  }
  // Handle save action
  const handleSave = async () => {
    // Validation
    if (!newValue || !confirmValue) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    if (newValue !== confirmValue) {
      Alert.alert('Error', 'Values do not match');
      return;
    }

    try {
      // Save to storage
      if (selectedOption === 'username') {
        
          // update the database ****************

        await AsyncStorage.setItem('un', newValue);
        setUser(newValue);
        Alert.alert('Success', 'Username updated updated successfully');
      } else {
        await AsyncStorage.setItem('pw', newValue); // Update with your password key
        Alert.alert('Success', 'Password updated successfully');
      }
      
      // Reset and close modal
      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.log('Update failed:', error);
      Alert.alert('Error', 'Failed to update information');
    }
  };

  // Reset form fields
  const resetForm = () => {
    setNewValue('');
    setConfirmValue('');
    setSelectedOption('username');
  };

  return (
    <SafeAreaView style={mainStyles.safeArea}>
      <View style={mainStyles.background}>
        <GoalHeader
          title="Menu"
          subtitle="Your settings and info"
          showToggle={false} />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Account Information Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Account Information</Text>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="pencil" size={20} color="#1a73e8" />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Username: {username}</Text>
              <Text style={styles.infoText}>Email: {email}</Text>
              <Text style={styles.infoText}>Member Since: Jan 2023</Text>
            </View>
          </View>

          {/* Contact Us Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => {
              alert('Contact form coming soon!');
            }}>
              <Text style={styles.buttonText}>Send Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => {
              navigation.navigate('Help');
            }}>
              <Text style={styles.buttonText}>Help Center</Text>
            </TouchableOpacity>
          </View>

          {/* Logout Section */}
          <View style={styles.logoutSection}>
            <TouchableOpacity style={styles.logoutButton} onPress={() => {
              Alert.alert('Logging out...');
              clearAll()
            }}>
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Update Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            resetForm();
            setModalVisible(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Update Account</Text>
              
              {/* Option Selection */}
              <View style={styles.optionContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selectedOption === 'username' && styles.selectedOption
                  ]}
                  onPress={() => setSelectedOption('username')}
                >
                  <Text style={[
                    styles.optionText,
                    selectedOption === 'username' && styles.selectedOptionText
                  ]}>Update Username</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    selectedOption === 'password' && styles.selectedOption
                  ]}
                  onPress={() => setSelectedOption('password')}
                >
                  <Text style={[
                    styles.optionText,
                    selectedOption === 'password' && styles.selectedOptionText
                  ]}>Update Password</Text>
                </TouchableOpacity>
              </View>

              {/* Input Fields */}
              <TextInput
                style={styles.input}
                placeholder={`New ${selectedOption}`}
                value={newValue}
                onChangeText={setNewValue}
                secureTextEntry={selectedOption === 'password'}
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.input}
                placeholder={`Confirm New ${selectedOption}`}
                value={confirmValue}
                onChangeText={setConfirmValue}
                secureTextEntry={selectedOption === 'password'}
                autoCapitalize="none"
              />

              {/* Action Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    resetForm();
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    gap: 25,
    paddingBottom: 40
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
    flex: 1
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 5
  },
  editText: {
    fontSize: 16,
    color: '#1a73e8',
    fontWeight: '500'
  },
  infoContainer: {
    gap: 12
  },
  infoText: {
    fontSize: 16,
    color: '#4a4a4a',
    paddingVertical: 4
  },
  actionButton: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500'
  },
  logoutSection: {
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600'
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center'
  },
  optionContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center'
  },
  selectedOption: {
    backgroundColor: '#1a73e8',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2c3e50'
  },
  selectedOptionText: {
    color: '#ffffff'
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center'
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#1a73e8',
    alignItems: 'center'
  },
  cancelText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500'
  },
  saveText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500'
  }
});

export default MenuScreen;