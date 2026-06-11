import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const AddExpenseScreen = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('You');
  const [splitCount, setSplitCount] = useState('2');
  const [yourShare, setYourShare] = useState('');

  const handleAddExpense = async () => {
    if (!description.trim() || !amount.trim() || !splitCount.trim()) {
      Alert.alert('Missing Info', 'Please fill in all required fields');
      return;
    }

    try {
      const expenseAmount = parseFloat(amount);
      const split = parseInt(splitCount);
      const share = yourShare ? parseFloat(yourShare) : expenseAmount / split;

      const newExpense = {
        id: uuidv4(),
        description: description.trim(),
        amount: expenseAmount,
        paidBy,
        splitCount: split,
        yourShare: share,
        settled: false,
        createdAt: new Date().toISOString(),
      };

      const data = await AsyncStorage.getItem('billshareData');
      const parsed = JSON.parse(data);
      parsed.expenses.push(newExpense);
      await AsyncStorage.setItem('billshareData', JSON.stringify(parsed));

      Alert.alert('Success', 'Expense added!');
      setDescription('');
      setAmount('');
      setSplitCount('2');
      setYourShare('');
      setPaidBy('You');

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense');
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Expense Description *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Dinner, Uber, Movie"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount (KSH) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 400"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Paid By</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioButton, paidBy === 'You' && styles.radioSelected]}
              onPress={() => setPaidBy('You')}
            >
              <Text style={[styles.radioText, paidBy === 'You' && styles.radioTextSelected]}>You</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, paidBy === 'Friend' && styles.radioSelected]}
              onPress={() => setPaidBy('Friend')}
            >
              <Text style={[styles.radioText, paidBy === 'Friend' && styles.radioTextSelected]}>Friend</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Split Between *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 4"
            value={splitCount}
            onChangeText={setSplitCount}
            keyboardType="number-pad"
          />
          <Text style={styles.helper}>Number of people splitting</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Your Share (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Leave empty for equal split"
            value={yourShare}
            onChangeText={setYourShare}
            keyboardType="decimal-pad"
          />
          {amount && splitCount && !yourShare && (
            <Text style={styles.helper}>
              Your share: KSH {(parseFloat(amount) / parseInt(splitCount)).toFixed(2)}
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleAddExpense}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  form: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFF',
  },
  helper: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  radioButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  radioSelected: {
    borderColor: '#6C63FF',
    backgroundColor: '#F0EDFF',
  },
  radioText: {
    fontSize: 14,
    color: '#666',
  },
  radioTextSelected: {
    color: '#6C63FF',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddExpenseScreen;
