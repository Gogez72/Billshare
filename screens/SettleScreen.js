import React, { useState, useFocusEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const SettleScreen = () => {
  const [debts, setDebts] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      calculateDebts();
    }, [])
  );

  const calculateDebts = async () => {
    try {
      const data = await AsyncStorage.getItem('billshareData');
      if (data) {
        const parsed = JSON.parse(data);
        const unsettledExpenses = (parsed.expenses || []).filter((e) => !e.settled);
        const calculatedDebts = [];

        unsettledExpenses.forEach((expense) => {
          if (expense.paidBy === 'You' && expense.yourShare) {
            const amountOwedToYou = expense.amount - expense.yourShare;
            calculatedDebts.push({
              id: expense.id,
              type: 'owed_to_you',
              description: expense.description,
              amount: amountOwedToYou,
              fromFriend: 'Friend',
            });
          } else if (expense.paidBy !== 'You') {
            calculatedDebts.push({
              id: expense.id,
              type: 'you_owe',
              description: expense.description,
              amount: expense.yourShare || expense.amount / expense.splitCount,
              toFriend: 'Friend',
            });
          }
        });

        setDebts(calculatedDebts);
      }
    } catch (error) {
      console.error('Error calculating debts:', error);
    }
  };

  const handleMarkAsSettled = async (debtId) => {
    Alert.alert('Mark as Settled', 'Have you paid/received this amount?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            const data = await AsyncStorage.getItem('billshareData');
            const parsed = JSON.parse(data);
            const expenseIndex = parsed.expenses.findIndex((e) => e.id === debtId);
            if (expenseIndex !== -1) {
              parsed.expenses[expenseIndex].settled = true;
              await AsyncStorage.setItem('billshareData', JSON.stringify(parsed));
              calculateDebts();
              Alert.alert('Success', 'Payment marked as settled!');
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to update settlement');
          }
        },
      },
    ]);
  };

  const renderDebt = ({ item }) => (
    <View
      style={[
        styles.debtCard,
        item.type === 'owed_to_you' ? styles.debtCardGreen : styles.debtCardRed,
      ]}
    >
      <View style={styles.debtContent}>
        <Text style={styles.debtDescription}>{item.description}</Text>
        <Text style={styles.debtType}>
          {item.type === 'owed_to_you' ? item.fromFriend + ' owes you' : 'You owe ' + item.toFriend}
        </Text>
        <Text style={[styles.debtAmount, { color: item.type === 'owed_to_you' ? '#4CAF50' : '#FF6B6B' }]}>
          KSH {item.amount.toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.settleButton}
        onPress={() => handleMarkAsSettled(item.id)}
      >
        <Ionicons name="checkmark-circle" size={24} color="#6C63FF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {debts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-circle" size={64} color="#4CAF50" />
          <Text style={styles.emptyText}>All settled!</Text>
          <Text style={styles.emptySubtext}>No pending payments</Text>
        </View>
      ) : (
        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={renderDebt}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  list: {
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  debtCard: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  debtCardGreen: {
    backgroundColor: '#E8F5E9',
  },
  debtCardRed: {
    backgroundColor: '#FFEBEE',
  },
  debtContent: {
    flex: 1,
  },
  debtDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  debtType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  debtAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  settleButton: {
    marginLeft: 10,
    padding: 8,
  },
});

export default SettleScreen;
