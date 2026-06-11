# Billshare - Split Expenses App

**Billshare** is a mobile app for tracking shared expenses and splitting bills with friends. Built with React Native and Expo.

## Features

✅ **Add Expenses** - Log expenses with amount, who paid, and how many people are involved  
✅ **Smart Splitting** - Split equally, by percentage, or custom amounts  
✅ **Debt Tracking** - See who owes whom at a glance  
✅ **Settlement** - Mark payments as settled  
✅ **Groups** - Organize friends into groups  
✅ **Local Storage** - All data stored on your device (no cloud needed yet)  
✅ **Works Offline** - Use M-Pesa or bank transfer, then mark as paid  

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Gogez72/billshare.git
   cd billshare
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the app:
   ```bash
   npm start
   ```

4. Run on your device:
   - **iOS**: Press `i` in the terminal
   - **Android**: Press `a` in the terminal
   - **Web**: Press `w` in the terminal

## How to Use

### 1. Add an Expense
   - Go to **"Add Expense"** tab
   - Enter expense description (e.g., "Dinner")
   - Enter amount in KSH
   - Select who paid (You or Friend)
   - Enter how many people are splitting
   - Optionally enter your custom share
   - Tap **"Add Expense"**

### 2. Track Debts
   - Go to **"Dashboard"** to see totals
   - Check **"Settle Up"** for pending payments
   - Tap the checkmark to mark payments as settled

### 3. Manage Groups
   - Go to **"Groups"** tab
   - Create groups for different friend circles
   - Add members to track group expenses (coming soon)

## Project Structure

```
billshare/
├── App.js                          # Main app entry point
├── screens/
│   ├── HomeScreen.js              # Dashboard with totals
│   ├── AddExpenseScreen.js        # Add new expenses
│   ├── GroupsScreen.js            # Manage groups
│   └── SettleScreen.js            # Track settlements
├── package.json
├── app.json                       # Expo configuration
└── README.md
```

## Data Storage

Data is stored locally in AsyncStorage:
```json
{
  "expenses": [
    {
      "id": "uuid",
      "description": "Dinner",
      "amount": 400,
      "paidBy": "You",
      "splitCount": 4,
      "yourShare": 100,
      "settled": false
    }
  ],
  "groups": [],
  "friends": []
}
```

## Future Enhancements

- [ ] M-Pesa integration for payments
- [ ] Google Firebase for cloud sync
- [ ] User authentication
- [ ] Friend profiles
- [ ] Receipt photo upload
- [ ] Expense categories
- [ ] Monthly reports
- [ ] Dark mode
- [ ] Multi-currency support

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **Storage**: AsyncStorage
- **Icons**: Expo Icons (Ionicons)
- **UUID**: uuid library

## Contributing

Feel free to fork, improve, and submit pull requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

Having issues? Check the [Expo documentation](https://docs.expo.dev/) or open an issue in the repository.

---

**Made in Kenya** 🇰🇪 - Perfect for Kenyan users with M-Pesa!
