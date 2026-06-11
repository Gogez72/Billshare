import React, { useEffect, useState, useFocusEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalOwed, setTotalOwed] = useState(0);
  const [totalOing, setTotalOing] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('billshareData');
      if (data) {
        const parsed = JSON.parse(data);
        setExpenses(parsed.expenses || []);
        calculateTotals(parsed.expenses || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const calculateTotals = (expenseList) => {
    let owed = 0;
    let owing = 0;

    expenseList.forEach(expense => {
      if (!expense.settled) {
        if (expense.paidBy === 'You') {
          owed += (expense.amount - (expense.yourShare || 0));
        } else {
          owing += expense.yourShare || 0;
        }
      }
    });

    setTotalOwed(owed);
    setTotalOing(owing);
  };

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseCard}>
      <View style={styles.expenseHeader}>
        <Text style={styles.expenseTitle}>{item.description}</Text>
        <Text style={[styles.expenseAmount, { color: item.paidBy === 'You' ? '#4CAF50' : '#FF6B6B' }]}>
          {item.paidBy === 'You' ? '+' : '-'}KSH {item.amount.toFixed(2)}
        </Text>
      </View>
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseText}>Paid by: {item.paidBy}</Text>
        <Text style={styles.expenseText}>Split: {item.splitCount} ways</Text>
        {item.yourShare && <Text style={styles.expenseText}>You owe: KSH {item.yourShare.toFixed(2)}</Text>}
      </View>
      {item.settled && <View style={styles.settledBadge}><Text style={styles.settledText}>Settled</Text></View>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>You are owed</Text>
          <Text style={styles.summaryAmount}>KSH {totalOwed.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#FFE0E0' }]}>
          <Text style={styles.summaryLabel}>You owe</Text>
          <Text style={[styles.summaryAmount, { color: '#FF6B6B' }]}>KSH {totalOing.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        {expenses.length === 0 ? (
          <Text style={styles.emptyText}>No expenses yet. Add one to get started!</Text>
        ) : (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={renderExpenseItem}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  expenseCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  expenseDetails: {
    marginTop: 5,
  },
  expenseText: {
    fontSize: 12,
    color: '#666',
    marginVertical: 2,
  },
  settledBadge: {
    marginTop: 8,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  settledText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
});

export default HomeScreen;
