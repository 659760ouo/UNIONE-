import { Dimensions, StyleSheet } from 'react-native';
const {width} = Dimensions.get('window')

export const styles = StyleSheet.create({
  // Main container styles
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  background: {
    flex: 1,
    width: width,
    backgroundColor: '#ffffffff',
  },
  scrolling: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Space for floating buttons
  },

  // Header styles
  header: {
    marginBottom: 50,
    paddingLeft: 20,
    top: '5%',
    
  },
  headerTitle: {
    fontSize: 32,
    width: '50%',
    fontWeight: 'bold',
    color: 'black',
    left: '5%'
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'black',
    marginTop: 4,
    marginLeft: 15,
    marginBottom: 20,
  },

  // Toggle button styles
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 30,
    padding: 4,
    width: 200,
    backgroundColor: '#374151',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToggleButton: {
    backgroundColor: '#2b2e30',
  },
  toggleText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Goal list and card styles
  goalListContainer: {
    width: '100%',
    alignItems: 'center',
  },
  goalCard: {
    width: width - 40,
    backgroundColor: '#212638ff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
    zIndex: 1,
  },

  // Checkbox styles
  checkbox: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  checkedCheckbox: {
    width: 12,
    height: 12,
    backgroundColor: '#22C55E',
    borderRadius: 3,
  },

  // Remove button styles
  removeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  removeButtonIcon: {
    color: '#EF4444',
  },

  // Status pill styles
  statusPill: {
    position: 'absolute',
    top: -10,
    right: 50, // Adjusted for remove button
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusPillText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Goal content styles
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    marginLeft: 40, // Space for checkbox
  },
  goalDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
    marginLeft: 40, // Space for checkbox
  },
  finishedGoalText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },

  // Metadata styles
  goalMetaContainer: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    width: 90,
  },
  metaValue: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },

  // Floating action buttons
  floatingContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    flexDirection: 'column',
    gap: 15,
    zIndex: 2,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingIcon: {
    tintColor: 'white',
    width: 24,
    height: 24,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#171616',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: 30,
   
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#374151',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: 'white',
    fontSize: 16,
  },
  modalTextArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Date picker styles
  datePickerButton: {
    width: '100%',
    backgroundColor: '#374151',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  datePickerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  datePicker: {
    backgroundColor: '#1F2937',
  },

  // Modal buttons
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#374151',
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Empty state styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  emptyStateText:{
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    
  },
  orderPick_container:{ 
    width: '90%',
    
    height: 45,
    backgroundColor: '#d9d9d9',
    borderRadius: 99,
    marginBottom: 15,
    overflow: 'hidden',
    
  },
  sortPicker: {
    top: '-5%',
    left: '2%'
  }

})
export default styles