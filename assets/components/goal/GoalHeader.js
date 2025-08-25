import { Pressable, Text, View } from 'react-native';
import { styles } from '../../../app/styles/Main_style';

const GoalHeader = ({ title, subtitle, activeView, setActiveView, showToggle }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Text style={styles.headerSubtitle}>{subtitle}</Text>
      
      {showToggle && (
        <View style={styles.toggleContainer}>
          <Pressable
            style={[styles.toggleButton, activeView === 'ongoing' && styles.activeToggleButton]}
            onPress={() => setActiveView('ongoing')}
          >
            <Text style={[styles.toggleText, activeView === 'ongoing' && {color: 'white'
            }]}>Ongoing</Text>
          </Pressable>
          <Pressable
            style={[styles.toggleButton, activeView === 'finished' && styles.activeToggleButton]}
            onPress={() => setActiveView('finished')}
          >
            <Text style={[styles.toggleText, activeView === 'finished' && {color: 'white'
            }]}>Finished</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default GoalHeader;
