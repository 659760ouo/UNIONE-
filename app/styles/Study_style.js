import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  mainContent: {
    padding: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3182ce',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: '40%',
    marginLeft: 'auto',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },

  // Books Section
  booksScroll: {
    height: 200,
    marginBottom: 20,
  },
  booksContainer: {
    paddingHorizontal: 5,
    gap: 15,
  },
  bookCard: {
    width: 160,
    padding: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'space-between',
  },
  roundedBook: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4299e1',
  },
  sharpBook: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ed8936',
    borderStyle: 'solid',
  },
  dottedBook: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#38b2ac',
    borderStyle: 'dashed',
  },
  selectedBook: {
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.3,
    elevation: 5,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  bookSubject: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 10,
  },
  bookHours: {
    fontSize: 13,
    color: '#4a5568',
    backgroundColor: '#edf2f7',
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },

  // Book Details
  bookDetailsScroll: {
    marginBottom: 20,
  },
  bookDetailsContent: {
    paddingBottom: 20,
  },
  bookDetails: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  detailsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 12,
  },

  // Timer Section
  timerSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#edf2f7',
    borderRadius: 10,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginVertical: 10,
  },
  timerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3182ce',
    padding: 8,
    borderRadius: 6,
  },
  timerButtonText: {
    color: 'white',
    fontSize: 16,
  },
  totalHours: {
    fontSize: 14,
    color: '#718096',
    marginTop: 5,
  },

  // Flashcard Section
  flashcardSection: {
    marginBottom: 20,
  },
  flashcardContainer: {
    marginBottom: 15,
  },
  flashcard: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 20,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  flashcardText: {
    fontSize: 18,
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 15,
  },
  flashcardAnswer: {
    fontSize: 16,
    color: '#38b2ac',
    textAlign: 'center',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  answerToggle: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
  },
  answerToggleText: {
    color: '#4a5568',
    fontSize: 14,
    fontWeight: '500',
  },
  flashcardNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  navButton: {
    padding: 5,
  },
  navText: {
    fontSize: 14,
    color: '#718096',
  },
  newFlashcardForm: {
    gap: 10,
    marginTop: 15,
  },

  // Vocabulary Section
  vocabSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  vocabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vocabList: {
    maxHeight: 300,
  },
  vocabItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  vocabWord: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  vocabMeaning: {
    fontSize: 14,
    color: '#4a5568',
  },
  vocabExample: {
    fontSize: 13,
    color: '#718096',
    fontStyle: 'italic',
  },
  fabButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3182ce',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  // Form Elements
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 6,
    fontSize: 16,
    color: '#2d3748',
  },
  formButton: {
    backgroundColor: '#3182ce',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  formButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 15,
  },
  themeSelector: {
    marginBottom: 20,
  },
  themeLabel: {
    fontSize: 16,
    color: '#4a5568',
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#cbd5e0',
    borderWidth: 1,
    borderRadius: 6,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
  },
  modalButtonText: {
    color: '#4a5568',
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: '#3182ce',
  },
  confirmText: {
    color: 'white',
  },
  emptyState: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    padding: 15,
  },
  // Add these to your existing styles
moreOptionsButton: {
  position: 'absolute',
  top: 5,
  right: 5,
  padding: 5,
},
bookContent: {
  flex: 1,
  marginRight: 25, // Make space for the 3-dot menu
},

// Action Sheet styles
actionSheetOverlay: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
actionSheetContent: {
  backgroundColor: 'white',
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  padding: 15,
  width: '100%',
},
actionSheetItem: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#e2e8f0',
},
actionIcon: {
  marginRight: 15,
},
actionSheetText: {
  fontSize: 16,
  color: '#2d3748',
},
deleteAction: {
  borderBottomWidth: 1,
  borderBottomColor: '#e2e8f0',
},
deleteActionText: {
  fontSize: 16,
  color: '#e53e3e',
},
cancelAction: {
  padding: 15,
  alignItems: 'center',
},
cancelActionText: {
  fontSize: 16,
  color: '#2d3748',
  fontWeight: 'bold',
},

// Flashcard Bank styles
flashcardBankButtonContainer: {
  marginBottom: 20,
},
flashcardBankButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  padding: 10,
  backgroundColor: '#edf2f7',
  borderRadius: 8,
  alignSelf: 'flex-start',
},
squareGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: 36,
  gap: 2,
},
square: {
  width: 16,
  height: 16,
  backgroundColor: '#3182ce',
  borderRadius: 2,
},
flashcardBankText: {
  color: '#2d3748',
  fontSize: 14,
  fontWeight: '500',
},
flashcardBankList: {
  maxHeight: 300,
  marginVertical: 15,
},
flashcardBankItem: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#e2e8f0',
  gap: 10,
},
checkbox: {
  width: 24,
  height: 24,
  borderRadius: 4,
  borderWidth: 2,
  borderColor: '#cbd5e0',
  justifyContent: 'center',
  alignItems: 'center',
},
flashcardBankItemContent: {
  flex: 1,
},
flashcardBankQuestion: {
  fontSize: 15,
  fontWeight: '500',
  color: '#2d3748',
  marginBottom: 4,
},
flashcardBankAnswer: {
  fontSize: 13,
  color: '#718096',
},
editButton: {
  padding: 5,
},
deleteSelectedButton: {
  alignSelf: 'flex-end',
  padding: 8,
  marginBottom: 10,
},
deleteSelectedText: {
  color: '#e53e3e',
  fontSize: 14,
  fontWeight: '500',
},
flashcardManageModalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  flashcardList: {
    // Ensure items wrap to new row when needed
    flexDirection: 'column', // Force vertical layout
    gap: 10,
    marginBottom: 15,
  },
  flashcardManageItem: {
    width: '100%', // Full width of container
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

});
export default styles