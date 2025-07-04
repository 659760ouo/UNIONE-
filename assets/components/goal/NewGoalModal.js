import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Platform,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { styles } from '../../../app/styles/Home_style';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Define formatDate directly in the component to avoid missing function errors
const formatDate = (date) => {
  if (!date) return '';
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

const NewGoalModal = ({
  visible,
  onClose,
  title,
  setTitle,
  description,
  setDescription,
  selectedDate,
  setSelectedDate,
  showDatePicker,
  setShowDatePicker,
  onConfirm
}) => {
  const handleDateChange = (event, selected) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
      if (Platform.OS === 'ios') setShowDatePicker(false);
    } else if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* KeyboardAvoidingView to handle keyboard overlap */}
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Goal</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Goal Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#9CA3AF"
              autoFocus
              returnKeyType="next"
            />
            
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Goal Description (optional)"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              returnKeyType="done"
            />
            
            <Pressable 
              style={styles.datePickerButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.datePickerContainer}>
                <MaterialIcons name="calendar-today" size={24} color="#9CA3AF" />
                {/* Use the local formatDate function */}
                <Text style={styles.datePickerText}>{formatDate(selectedDate)}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="#9CA3AF" />
              </View>
            </Pressable>
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={onClose}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={onConfirm}
              >
                <Text style={styles.modalButtonText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {showDatePicker && (
        <View style={styles.datePickerOverlay}>
          {Platform.OS === 'android' && (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, backgroundColor: '#1F2937' }}>
              <Pressable onPress={() => setShowDatePicker(false)} style={{ padding: 8, marginRight: 10 }}>
                <Text style={{ color: '#3B82F6', fontSize: 16 }}>Cancel</Text>
              </Pressable>
            </View>
          )}
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleDateChange}
            style={styles.datePicker}
          />
        </View>
      )}
    </Modal>
  );
};

export default NewGoalModal;
