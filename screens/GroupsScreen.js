import React, { useState, useFocusEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';

const GroupsScreen = () => {
  const [groups, setGroups] = useState([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [groupName, setGroupName] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadGroups();
    }, [])
  );

  const loadGroups = async () => {
    try {
      const data = await AsyncStorage.getItem('billshareData');
      if (data) {
        const parsed = JSON.parse(data);
        setGroups(parsed.groups || []);
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const handleAddGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Missing Info', 'Please enter a group name');
      return;
    }

    try {
      const newGroup = {
        id: uuidv4(),
        name: groupName.trim(),
        members: ['You'],
        createdAt: new Date().toISOString(),
      };

      const data = await AsyncStorage.getItem('billshareData');
      const parsed = JSON.parse(data);
      parsed.groups.push(newGroup);
      await AsyncStorage.setItem('billshareData', JSON.stringify(parsed));

      setGroupName('');
      setShowAddGroup(false);
      loadGroups();
      Alert.alert('Success', 'Group created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create group');
      console.error(error);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    Alert.alert('Delete Group', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const data = await AsyncStorage.getItem('billshareData');
            const parsed = JSON.parse(data);
            parsed.groups = parsed.groups.filter((g) => g.id !== groupId);
            await AsyncStorage.setItem('billshareData', JSON.stringify(parsed));
            loadGroups();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete group');
          }
        },
      },
    ]);
  };

  const renderGroup = ({ item }) => (
    <View style={styles.groupCard}>
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupMembers}>{item.members.length} members</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteGroup(item.id)}>
        <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {groups.length === 0 && !showAddGroup && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No groups yet</Text>
          <Text style={styles.emptySubtext}>Create a group to track shared expenses</Text>
        </View>
      )}

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroup}
        style={styles.listContainer}
        scrollEnabled={false}
      />

      {showAddGroup && (
        <View style={styles.addGroupForm}>
          <TextInput
            style={styles.input}
            placeholder="Group name (e.g., Friends, Family)"
            value={groupName}
            onChangeText={setGroupName}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowAddGroup(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleAddGroup}>
              <Text style={styles.submitButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddGroup(!showAddGroup)}
      >
        <Ionicons name={showAddGroup ? 'close' : 'add'} size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  groupCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  groupMembers: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  addGroupForm: {
    backgroundColor: '#FFF',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#6C63FF',
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default GroupsScreen;
