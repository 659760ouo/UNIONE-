import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Main container styles (Light theme base)
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Soft light background
  },
  background: {
    flex: 1,
    width: width,
    backgroundColor: '#F5F7FA',
  },
  scrolling: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Space for floating buttons
  },

  // Header styles (Light theme text)
  header: {
    marginBottom: 50,
    paddingLeft: 20,
    top: '5%',
  },
  headerTitle: {
    fontSize: 32,
    width: '50%',
    fontWeight: 'bold',
    color: '#1A202C', // Dark gray for readability
    left: '5%'
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#718096', // Muted gray
    marginTop: 4,
    marginLeft: 15,
    marginBottom: 20,
  },

  // Toggle button styles (Optimized for light theme)
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 30,
    padding: 3,
    width: 200,
    backgroundColor: '#E2E8F0', // Light gray background
    shadowColor: '#00000010',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'backgroundColor 0.2s ease', // Smooth state change
  },
  activeToggleButton: {
    backgroundColor: '#3B82F6', // Primary blue for active state
    shadowColor: '#3B82F630',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    
  },
  toggleText: {
    color: '#4A5568', // Dark gray for inactive
    fontSize: 16,
    fontWeight: '600',
  },

  // Goal list and card styles (Light theme cards)
  goalListContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16, // Consistent spacing between cards
  },
  goalCard: {
    width: width - 40,
    backgroundColor: 'white', // White cards for light theme
    borderRadius: 16, // Slightly reduced radius for modern look
    padding: 20,
    marginBottom: 12,
    shadowColor: '#0000001A', // Soft shadow
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    position: 'relative',
    zIndex: 1,
    borderRightWidth: 5,
    borderBottomWidth: 5,
    borderColor: 'rgba(48, 47, 47, 0.08)', // Subtle border
  },

  // Checkbox styles (Enhanced contrast)
  checkbox: {
    position: 'absolute',
    top: 22,
    left: 20,
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3B82F6', // Primary blue border
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: 'white', // White background for checkbox
  },
  checkedCheckbox: {
    width: 14,
    height: 14,
    backgroundColor: '#22C55E', // Green for checked
    borderRadius: 3,
  },
  emptyCheckbox: {
    width: 14,
    height: 14,
    backgroundColor: 'transparent', // Empty state
  },

  // Remove button styles (More visible)
  removeButton: {
    position: 'absolute',
    top: 22,
    right: 20,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderRadius: 50,
    backgroundColor: '#FEF2F2', // Light red background
  },
  removeButtonIcon: {
    color: '#EF4444', // Red icon
  },

  // Status pill styles (Improved visibility)
  statusPill: {
    position: 'absolute',
    top: -10,
    right: 50,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#00000010',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
  },
  statusPillText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  // Goal content styles (Light theme text)
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A202C', // Dark gray for title
    marginBottom: 8,
    marginLeft: 40, // Space for checkbox
  },
  goalDescription: {
    fontSize: 14,
    color: '#718096', // Muted gray for description
    marginBottom: 16,
    marginLeft: 40,
    lineHeight: 20, // Better readability
  },
  finishedGoalText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
    color: '#A0AEC0', // Lighter gray for finished items
  },

  // Metadata styles (Improved hierarchy)
  goalMetaContainer: {
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7', // Separator line
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#A0AEC0', // Muted label color
    width: 90,
  },
  metaValue: {
    fontSize: 12,
    color: '#3B82F6', // Primary blue for values
    fontWeight: '500',
  },

  // Floating action buttons (Consistent with theme)
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
    shadowColor: '#00000030',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 6,
  },
  floatingIcon: {
    tintColor: 'white',
    width: 24,
    height: 24,
  },

  // Modal styles (Light theme adaptation)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: 30,
    shadowColor: '#00000020',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#1A202C',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalTextArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Date picker styles (Light theme)
  datePickerButton: {
    width: '100%',
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    color: '#1A202C',
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
    backgroundColor: 'white',
  },

  // Modal buttons (Consistent with theme)
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
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
  },
  modalButtonText: {
    
    fontSize: 16,
    fontWeight: '600',
  },

  // Empty state styles (Light theme)
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#718096',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Sorting bar styles (Optimized for light theme)
  orderPick_container: {
    width: '90%',
    height: 48,
    backgroundColor: 'white',
    borderRadius: 12, // Less rounded for modern look
    marginBottom: 20,
    overflow: 'hidden',
    alignSelf: 'center', // Centered in container
    shadowColor: '#00000014',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortPicker: {
    
    color: '#1A202C', // Dark text for picker
    paddingHorizontal: 16,
    fontSize: 16,
  }
});

export default styles;