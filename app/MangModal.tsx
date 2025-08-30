import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import styles from './styles/Study_style';

// Type definitions
type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

type Vocabulary = {
  id: string;
  word: string;
  meaning: string;
  example: string;
};

type ManageableItem = Flashcard | Vocabulary;

type UniversalManageModalProps = {
  visible: boolean;
  type: 'flashcards' | 'vocabulary';
  items: ManageableItem[];
  selectedItems: string[];
  editingItem: ManageableItem | null;
  onClose: () => void;
  onToggleItem: (id: string) => void;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  onStartEditing: (item: ManageableItem) => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
  onChangeEditing: (field: string, value: string) => void;
};

const UniversalManageModal: React.FC<UniversalManageModalProps> = ({
  visible,
  type,
  items,
  selectedItems,
  editingItem,
  onClose,
  onToggleItem,
  onSelectAll,
  onDeleteSelected,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  onChangeEditing,
}) => {
  if (!visible) return null;

  const getTitle = () => {
    return editingItem 
      ? `Edit ${type === 'flashcards' ? 'Flashcard' : 'Vocabulary'}`
      : `Manage ${type === 'flashcards' ? 'Flashcards' : 'Vocabulary'}`;
  };

  const renderFormFields = () => {
    if (!editingItem) return null;

    if (type === 'flashcards') {
      const flashcard = editingItem as Flashcard;
      return (
        <>
          <TextInput
            style={styles.modalInput}
            placeholder="Question"
            value={flashcard.question}
            onChangeText={(text) => onChangeEditing('question', text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Answer"
            value={flashcard.answer}
            onChangeText={(text) => onChangeEditing('answer', text)}
          />
        </>
      );
    } else {
      const vocab = editingItem as Vocabulary;
      return (
        <>
          <TextInput
            style={styles.modalInput}
            placeholder="Word"
            value={vocab.word}
            onChangeText={(text) => onChangeEditing('word', text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Meaning"
            value={vocab.meaning}
            onChangeText={(text) => onChangeEditing('meaning', text)}
          />
          <TextInput
            style={styles.modalInput}
            placeholder="Example"
            value={vocab.example}
            onChangeText={(text) => onChangeEditing('example', text)}
          />
        </>
      );
    }
  };

  const renderItemContent = (item: ManageableItem) => {
    if (type === 'flashcards') {
      const flashcard = item as Flashcard;
      return (
        <View style={styles.flashcardBankItemContent}>
          <Text style={styles.flashcardBankQuestion}>{flashcard.question}</Text>
          <Text style={styles.flashcardBankAnswer}>{flashcard.answer}</Text>
        </View>
      );
    } else {
      const vocab = item as Vocabulary;
      return (
        <View style={styles.flashcardBankItemContent}>
          <Text style={styles.flashcardBankQuestion}>{vocab.word}</Text>
          <Text style={styles.flashcardBankAnswer}>{vocab.meaning}</Text>
        </View>
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.actionSheetOverlay}>
        <View style={styles.flashcardManageModalContent}>
          <Text style={styles.modalTitle}>{getTitle()}</Text>

          {editingItem ? (
            // Edit form
            <View style={{ gap: 15 }}>
              {renderFormFields()}
              <View style={styles.modalButtons}>
                <Pressable style={styles.modalButton} onPress={onCancelEditing}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </Pressable>
                <Pressable 
                  style={[styles.modalButton, styles.confirmButton]} 
                  onPress={onSaveEditing}
                >
                  <Text style={[styles.modalButtonText, styles.confirmText]}>Save</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            // Management list
            <>
              <Pressable 
                style={styles.flashcardBankItem} 
                onPress={onSelectAll}
              >
                <Checkbox
                  value={selectedItems.length === items.length && items.length > 0}
                  onValueChange={onSelectAll}
                />
                <Text style={styles.flashcardBankQuestion}>
                  {selectedItems.length === items.length && items.length > 0 
                    ? 'Deselect All' 
                    : 'Select All'}
                </Text>
              </Pressable>

              {selectedItems.length > 0 && (
                <Pressable 
                  style={styles.deleteSelectedButton} 
                  onPress={onDeleteSelected}
                >
                  <Text style={styles.deleteSelectedText}>
                    Delete {selectedItems.length} selected {type === 'flashcards' ? 'flashcards' : 'terms'}
                  </Text>
                </Pressable>
              )}

              <ScrollView style={styles.flashcardBankList}>
                {items.length === 0 ? (
                  <Text style={styles.emptyState}>
                    No {type === 'flashcards' ? 'flashcards' : 'vocabulary terms'} available
                  </Text>
                ) : (
                  items.map((item) => (
                    <View key={item.id} style={styles.flashcardBankItem}>
                      <Checkbox
                        value={selectedItems.includes(item.id)}
                        onValueChange={() => onToggleItem(item.id)}
                      />
                      {renderItemContent(item)}
                      <Pressable 
                        style={styles.editButton}
                        onPress={() => onStartEditing(item)}
                      >
                        <Ionicons name="pencil" size={20} color="#3182ce" />
                      </Pressable>
                    </View>
                  ))
                )}
              </ScrollView>

              <View style={styles.modalButtons}>
                <Pressable 
                  style={[styles.modalButton, styles.confirmButton]} 
                  onPress={onClose}
                >
                  <Text style={[styles.modalButtonText, styles.confirmText]}>Close</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default UniversalManageModal;