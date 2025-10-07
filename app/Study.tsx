import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';

import UniversalManageModal from './MangModal'; // Import the universal modal
import styles from './styles/Study_style';

// Type definitions
type Book = {
  id: string;
  title: string;
  subject: string;
  theme: 'rounded' | 'sharp' | 'dotted';
  studyHours: number;
  flashcards: { id: string; question: string; answer: string }[];
};

type Vocabulary = {
  id: string;
  word: string;
  meaning: string;
  example: string;
};

// New type to track timer state per book
type BookTimerState = {
  [bookId: string]: {
    studyTime: number;
    isActive: boolean;
  };
};

const { width } = Dimensions.get('window');

const StudyArea = () => {
  // State management
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'Algebra Fundamentals',
      subject: 'Mathematics',
      theme: 'rounded',
      studyHours: 3.2,
      flashcards: [
        { id: 'f1', question: 'What is x in 2x = 10?', answer: 'x = 5' },
        { id: 'f2', question: 'Solve: x + 7 = 15', answer: 'x = 8' }
      ]
    },
    {
      id: '2',
      title: 'English Literature',
      subject: 'Language Arts',
      theme: 'sharp',
      studyHours: 5.7,
      flashcards: [
        { id: 'f3', question: 'Who wrote Hamlet?', answer: 'William Shakespeare' },
        { id: 'f4', question: 'Define metaphor', answer: 'A figure of speech comparing two unrelated things' }
      ]
    }
  ]);

  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([
    {
      id: 'v1',
      word: 'Ephemeral',
      meaning: 'Lasting for a very short time',
      example: 'The ephemeral beauty of cherry blossoms'
    },
    {
      id: 'v2',
      word: 'Quintessential',
      meaning: 'Representing the most perfect or typical example',
      example: 'She is the quintessential artist'
    }
  ]);

  // UI State
  const [newBookModal, setNewBookModal] = useState(false);
  const [vocabModal, setVocabModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [bookTimerStates, setBookTimerStates] = useState<BookTimerState>({});
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [newFlashcard, setNewFlashcard] = useState({ question: '', answer: '' });
  const [newVocab, setNewVocab] = useState({ word: '', meaning: '', example: '' });
  const [newBook, setNewBook] = useState({ title: '', subject: '', theme: 'rounded' });

  // Management modals state
  const [manageFlashcardsModal, setManageFlashcardsModal] = useState(false);
  const [manageVocabModal, setManageVocabModal] = useState(false);
  const [selectedFlashcards, setSelectedFlashcards] = useState<string[]>([]);
  const [selectedVocab, setSelectedVocab] = useState<string[]>([]);
  const [editingFlashcard, setEditingFlashcard] = useState<{id: string; question: string; answer: string} | null>(null);
  const [editingVocab, setEditingVocab] = useState<Vocabulary | null>(null);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update timer when selected book or its timer state changes, means: switching books will pause previous timer and start new one if active
  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start timer if there's a selected book and its timer is active
    if (selectedBook) {
      const timerState = bookTimerStates[selectedBook.id] || { studyTime: 0, isActive: false };
      
      if (timerState.isActive) {
        timerRef.current = setInterval(() => {
          setBookTimerStates(prev => ({
            ...prev,
            [selectedBook.id]: {
              ...prev[selectedBook.id],
              studyTime: (prev[selectedBook.id]?.studyTime || 0) + 1
            }
          }));
        }, 1000);
      }
    }
  }, [selectedBook, bookTimerStates]);

  // Timer controls
  const toggleTimer = () => {
    if (!selectedBook) return;

    setBookTimerStates(prev => {
      const currentState = prev[selectedBook.id] || { studyTime: 0, isActive: false };
      const newState = { ...currentState, isActive: !currentState.isActive };
      
      // Save time to book's total hours when pausing
      if (currentState.isActive) {
        const updatedHours = selectedBook.studyHours + currentState.studyTime / 3600;
        updateBookHours(selectedBook.id, updatedHours);
      }
      
      return { ...prev, [selectedBook.id]: newState };
    });
  };

  // Format time (seconds to HH:MM:SS)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Add new book
  const addBook = () => {
    if (!newBook.title.trim() || !newBook.subject.trim()) return;

    const book: Book = {
      id: Date.now().toString(),
      ...newBook,
      studyHours: 0,
      flashcards: []
    };

    setBooks([...books, book]);
    setNewBookModal(false);
    setNewBook({ title: '', subject: '', theme: 'rounded' });
  };

  // Update book study hours
  const updateBookHours = (bookId: string, hours: number) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId ? { ...book, studyHours: hours } : book
    ));
    setSelectedBook(prev => prev?.id === bookId ? { ...prev, studyHours: hours } : prev);
  };

  // Add new flashcard
  const addFlashcard = () => {
    if (!selectedBook || !newFlashcard.question.trim() || !newFlashcard.answer.trim()) return;

    const updatedBooks = books.map(book => {
      if (book.id === selectedBook.id) {
        return {
          ...book,
          flashcards: [...book.flashcards, { 
            id: Date.now().toString(), 
            ...newFlashcard 
          }]
        };
      }
      return book;
    });

    setBooks(updatedBooks);
    setSelectedBook(prev => prev 
      ? { ...prev, flashcards: [...prev.flashcards, { 
          id: Date.now().toString(), 
          ...newFlashcard 
        }] 
      } 
      : null
    );
    setNewFlashcard({ question: '', answer: '' });
  };

  // Add new vocabulary
  const addVocabulary = () => {
    if (!newVocab.word.trim() || !newVocab.meaning.trim()) return;

    setVocabulary([...vocabulary, {
      id: Date.now().toString(),
      ...newVocab
    }]);
    setNewVocab({ word: '', meaning: '', example: '' });
    setVocabModal(false);
  };

  // Handle book selection
  const handleBookSelection = (book: Book) => {
    // If selecting the same book, do nothing
    if (selectedBook?.id === book.id) {
      return;
    }

    // If switching from another book, save its timer state and pause
    if (selectedBook) {
      const currentTimerState = bookTimerStates[selectedBook.id];
      if (currentTimerState?.isActive) {
        // Save current timer to total hours
        const updatedHours = selectedBook.studyHours + currentTimerState.studyTime / 3600;
        updateBookHours(selectedBook.id, updatedHours);
        
        // Pause the timer
        setBookTimerStates(prev => ({
          ...prev,
          [selectedBook.id]: { ...currentTimerState, isActive: false }
        }));
      }
    }

    // Set new selected book (will trigger timer effect)
    setSelectedBook(book);
    setCurrentFlashcardIndex(0);
    setShowFlashcardAnswer(false);
    setSelectedFlashcards([]);
  };

  // Flashcard management functions
  const toggleFlashcardSelection = (id: string) => {
    setSelectedFlashcards(prev => 
      prev.includes(id)
        ? prev.filter(flashcardId => flashcardId !== id)
        : [...prev, id]
    );
  };

  const selectAllFlashcards = () => {
    if (!selectedBook) return;
    if (selectedFlashcards.length === selectedBook.flashcards.length) {
      setSelectedFlashcards([]);
    } else {
      setSelectedFlashcards(selectedBook.flashcards.map(fc => fc.id));
    }
  };

  const deleteSelectedFlashcards = () => {
  if (!selectedBook || selectedFlashcards.length === 0) return;

  // Show confirmation alert
  Alert.alert(
    "Confirm Deletion",
    `Are you sure you want to delete ${selectedFlashcards.length} flashcard(s)? This action cannot be undone.`,
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: () => {
          // Proceed with deletion only if user confirms
          const updatedBooks = books.map(book => {
            if (book.id === selectedBook.id) {
              return {
                ...book,
                flashcards: book.flashcards.filter(fc => !selectedFlashcards.includes(fc.id))
              };
            }
            return book;
          });

          setBooks(updatedBooks);
          setSelectedBook(prev => prev 
            ? { ...prev, flashcards: prev.flashcards.filter(fc => !selectedFlashcards.includes(fc.id)) } 
            : null
          );
          setSelectedFlashcards([]);
          setCurrentFlashcardIndex(0);
          setManageFlashcardsModal(false); // Close modal after deletion
        }
      }
    ]
  );
  };

  const startEditingFlashcard = (flashcard: {id: string; question: string; answer: string}) => {
    setEditingFlashcard({...flashcard});
  };

  const saveEditedFlashcard = () => {
    if (!selectedBook || !editingFlashcard) return;

    const updatedBooks = books.map(book => {
      if (book.id === selectedBook.id) {
        return {
          ...book,
          flashcards: book.flashcards.map(fc => 
            fc.id === editingFlashcard.id ? editingFlashcard : fc
          )
        };
      }
      return book;
    });

    setBooks(updatedBooks);
    setSelectedBook(prev => prev 
      ? { ...prev, flashcards: prev.flashcards.map(fc => 
          fc.id === editingFlashcard.id ? editingFlashcard : fc
        )} 
      : null
    );
    setEditingFlashcard(null);
  };

  // Vocabulary management functions
  const toggleVocabSelection = (id: string) => {
    setSelectedVocab(prev => 
      prev.includes(id)
        ? prev.filter(vocabId => vocabId !== id)
        : [...prev, id]
    );
  };

  const selectAllVocab = () => {
    if (selectedVocab.length === vocabulary.length) {
      setSelectedVocab([]);
    } else {
      setSelectedVocab(vocabulary.map(v => v.id));
    }
  };

  const deleteSelectedVocab = () => {
  if (selectedVocab.length === 0) return;

  Alert.alert(
    "Confirm Deletion",
    `Delete ${selectedVocab.length} vocabulary term(s)? This cannot be undone.`,
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: () => {
          // Proceed with deletion only if confirmed
          setVocabulary(vocabulary.filter(v => !selectedVocab.includes(v.id)));
          setSelectedVocab([]);
          setManageVocabModal(false); // Close modal after deletion
        }
      }
    ]
  );
  };

  const startEditingVocab = (vocab: Vocabulary) => {
    setEditingVocab({...vocab});
  };

  const saveEditedVocab = () => {
    if (!editingVocab) return;

    setVocabulary(vocabulary.map(v => 
      v.id === editingVocab.id ? editingVocab : v
    ));
    setEditingVocab(null);
  };

  // Create sections for FlatList
  const getSections = () => {
    const sections = [
      { id: 'header', type: 'header' },
      { id: 'books', type: 'books' },
    ];

    if (selectedBook) {
      sections.push({ id: 'bookDetails', type: 'bookDetails' });
    }

    sections.push({ id: 'vocabulary', type: 'vocabulary' });
    return sections;
  };

  // Render individual FlatList items
  const renderItem = ({ item }: { item: { id: string; type: string } }) => {
    switch (item.type) {
      case 'header':
        return (
          <View>
            <Text style={styles.title}>Study Area</Text>
            <Pressable 
              style={styles.addButton}
              onPress={() => setNewBookModal(true)}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.addButtonText}>New Book</Text>
            </Pressable>
          </View>
        );

      case 'books':
        return (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.booksScroll}
            contentContainerStyle={styles.booksContainer}
          >
            {books.map(book => (
              <Pressable
                key={book.id}
                style={[
                  styles.bookCard,
                  book.theme === 'rounded' && styles.roundedBook,
                  book.theme === 'sharp' && styles.sharpBook,
                  book.theme === 'dotted' && styles.dottedBook,
                  selectedBook?.id === book.id && styles.selectedBook
                ]}
                onPress={() => handleBookSelection(book)}
              >
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookSubject}>{book.subject}</Text>
                <Text style={styles.bookHours}>{book.studyHours.toFixed(1)} hrs</Text>
              </Pressable>
            ))}
          </ScrollView>
        );

      case 'bookDetails':
        // Get current book's timer state or default
        const timerState = bookTimerStates[selectedBook?.id || ''] || { studyTime: 0, isActive: false };
        
        return (
          <ScrollView 
            style={styles.bookDetailsScroll}
            contentContainerStyle={styles.bookDetailsContent}
            nestedScrollEnabled
          >
            <View style={styles.bookDetails}>
              <Text style={styles.detailsHeader}>{selectedBook?.title}</Text>
              
              {/* Study Timer */}
              <View style={styles.timerSection}>
                <Text style={styles.sectionTitle}>Study Timer</Text>
                <View style={styles.timerDisplay}>
                  <Text style={styles.timerText}>{formatTime(timerState.studyTime)}</Text>
                  <Pressable 
                    style={styles.timerButton}
                    onPress={toggleTimer}
                  >
                    <Ionicons 
                      name={timerState.isActive ? "pause" : "play"} 
                      size={20} 
                      color="white" 
                    />
                    <Text style={styles.timerButtonText}>
                      {timerState.isActive ? "Pause" : "Start"}
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.totalHours}>
                  Total Study Hours: {selectedBook?.studyHours.toFixed(1)}
                </Text>
              </View>

              {/* Flashcards */}
              <View style={styles.flashcardSection}>
                <View style={styles.vocabHeader}>
                  <Text style={styles.sectionTitle}>Flashcards</Text>
                  <Pressable 
                    style={styles.fabButton}
                    onPress={() => setManageFlashcardsModal(true)}
                  >
                    <Ionicons name="grid" size={24} color="white" />
                  </Pressable>
                </View>
                
                {selectedBook?.flashcards.length ? (
                  <View style={styles.flashcardContainer}>
                    <View style={styles.flashcard}>
                      <Text style={styles.flashcardText}>
                        {selectedBook.flashcards[currentFlashcardIndex].question}
                      </Text>
                      
                      {showFlashcardAnswer && (
                        <Text style={styles.flashcardAnswer}>
                          {selectedBook.flashcards[currentFlashcardIndex].answer}
                        </Text>
                      )}
                      
                      <Pressable
                        style={styles.answerToggle}
                        onPress={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
                      >
                        <Text style={styles.answerToggleText}>
                          {showFlashcardAnswer ? "Hide Answer" : "Show Answer"}
                        </Text>
                      </Pressable>
                    </View>
                    
                    <View style={styles.flashcardNav}>
                      <Pressable
                        style={styles.navButton}
                        onPress={() => setCurrentFlashcardIndex(prev => 
                          prev > 0 ? prev - 1 : (selectedBook?.flashcards.length || 0) - 1
                        )}
                      >
                        <Ionicons name="chevron-back" size={24} color="#333" />
                      </Pressable>
                      
                      <Text style={styles.navText}>
                        {currentFlashcardIndex + 1} / {selectedBook.flashcards.length}
                      </Text>
                      
                      <Pressable
                        style={styles.navButton}
                        onPress={() => setCurrentFlashcardIndex(prev => 
                          prev < (selectedBook?.flashcards.length || 0) - 1 ? prev + 1 : 0
                        )}
                      >
                        <Ionicons name="chevron-forward" size={24} color="#333" />
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <Text style={styles.emptyState}>No flashcards yet. Add one below!</Text>
                )}
                
                {/* Add Flashcard Form */}
                <View style={styles.newFlashcardForm}>
                  <TextInput
                    style={styles.input}
                    placeholder="Question"
                    value={newFlashcard.question}
                    onChangeText={text => setNewFlashcard(prev => ({ ...prev, question: text }))}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Answer"
                    value={newFlashcard.answer}
                    onChangeText={text => setNewFlashcard(prev => ({ ...prev, answer: text }))}
                  />
                  <Pressable style={styles.formButton} onPress={addFlashcard}>
                    <Text style={styles.formButtonText}>Add Flashcard</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case 'vocabulary':
        return (
          <View style={styles.vocabSection}>
            <View style={styles.vocabHeader}>
              <Text style={styles.sectionTitle}>Vocabulary/Keywords</Text>
              <Pressable 
                style={styles.fabButton}
                onPress={() => setManageVocabModal(true)}
              >
                <Ionicons name="grid" size={24} color="white" />
              </Pressable>
            </View>
            
            <FlatList
              data={vocabulary}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.vocabItem}>
                  <Text style={styles.vocabWord}>{item.word}</Text>
                  <Text style={styles.vocabMeaning}>{item.meaning}</Text>
                  <Text style={styles.vocabExample}>"{item.example}"</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyState}>No vocabulary added yet</Text>}
              style={styles.vocabList}
              nestedScrollEnabled
            />

            <Pressable 
              style={[styles.formButton, { marginTop: 15 }]}
              onPress={() => setVocabModal(true)}
            >
              <Text style={styles.formButtonText}>Add New Vocabulary</Text>
            </Pressable>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={getSections()}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        nestedScrollEnabled
      />

      {/* New Book Modal */}
      <Modal visible={newBookModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Book</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Book Title"
              value={newBook.title}
              onChangeText={text => setNewBook(prev => ({ ...prev, title: text }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Subject"
              value={newBook.subject}
              onChangeText={text => setNewBook(prev => ({ ...prev, subject: text }))}
            />
            <View style={styles.themeSelector}>
              <Text style={styles.themeLabel}>Select Theme</Text>
              <Picker
                selectedValue={newBook.theme}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setNewBook(prev => ({ ...prev, theme: itemValue as 'rounded' | 'sharp' | 'dotted' }))
                }
              >
                <Picker.Item label="Rounded" value="rounded" />
                <Picker.Item label="Sharp" value="sharp" />
                <Picker.Item label="Dotted" value="dotted" />
              </Picker>
            </View>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={() => setNewBookModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.confirmButton]} onPress={addBook}>
                <Text style={[styles.modalButtonText, styles.confirmText]}>Add Book</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Vocabulary Modal */}
      <Modal visible={vocabModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Vocabulary</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Word"
              value={newVocab.word}
              onChangeText={text => setNewVocab(prev => ({ ...prev, word: text }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Meaning"
              value={newVocab.meaning}
              onChangeText={text => setNewVocab(prev => ({ ...prev, meaning: text }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Example sentence"
              value={newVocab.example}
              onChangeText={text => setNewVocab(prev => ({ ...prev, example: text }))}
            />
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={() => setVocabModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.confirmButton]} onPress={addVocabulary}>
                <Text style={[styles.modalButtonText, styles.confirmText]}>Add Vocabulary</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Universal Management Modals */}
      <UniversalManageModal
        visible={manageFlashcardsModal}
        type="flashcards"
        items={selectedBook?.flashcards || []}
        selectedItems={selectedFlashcards}
        editingItem={editingFlashcard}
        onClose={() => setManageFlashcardsModal(false)}
        onToggleItem={toggleFlashcardSelection}
        onSelectAll={selectAllFlashcards}
        onDeleteSelected={deleteSelectedFlashcards}
        onStartEditing={startEditingFlashcard}
        onSaveEditing={saveEditedFlashcard}
        onCancelEditing={() => setEditingFlashcard(null)}
        onChangeEditing={(field, value) => {
          if (editingFlashcard) {
            setEditingFlashcard(prev => prev && ({ ...prev, [field]: value }));
          }
        }}
      />

      <UniversalManageModal
        visible={manageVocabModal}
        type="vocabulary"
        items={vocabulary}
        selectedItems={selectedVocab}
        editingItem={editingVocab}
        onClose={() => setManageVocabModal(false)}
        onToggleItem={toggleVocabSelection}
        onSelectAll={selectAllVocab}
        onDeleteSelected={deleteSelectedVocab}
        onStartEditing={startEditingVocab}
        onSaveEditing={saveEditedVocab}
        onCancelEditing={() => setEditingVocab(null)}
        onChangeEditing={(field, value) => {
          if (editingVocab) {
            setEditingVocab(prev => prev && ({ ...prev, [field]: value }));
          }
        }}
      />
    </SafeAreaView>
  );
};

export default StudyArea;