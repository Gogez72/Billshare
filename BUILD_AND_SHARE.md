# 🚀 Build & Share Billshare APK - Quick Guide

This guide will help you build the APK in **5 minutes** and share it with friends.

## Prerequisites (One-Time Setup)

### 1. Create Expo Account
- Go to https://expo.dev
- Click **Sign Up**
- Use your email
- Verify email

### 2. Install EAS CLI
```bash
npm install -g eas-cli
```

---

## Build Process (Takes ~10 minutes)

### Step 1: Login
```bash
eas login
```
Enter your Expo email & password

### Step 2: Initialize EAS (First time only)
```bash
cd billshare
eas init
```
- Press Enter for Project ID (auto-generates)
- Accept defaults

### Step 3: Build the APK
```bash
eas build --platform android --preview
```

**Wait for it to finish** (you'll see progress in terminal)

### Step 4: Get Your Download Link
When done, you'll see:
```
✅ Build finished!
📱 Download link: https://...
📲 QR Code: [scan to download]
```

---

## Share with Friends

### Option A: Send Download Link
1. Copy the download link
2. Share via WhatsApp/Email/Telegram
3. Friends tap link on Android phone
4. Auto-downloads APK
5. Tap **Install**

### Option B: Send QR Code
1. Screenshot the QR code
2. Friends scan it with phone camera
3. Opens download link
4. Tap **Install**

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "eas-cli not found" | Run: `npm install -g eas-cli` |
| Build fails | Run: `npm install` then try again |
| Friends can't install | They need Android 5.0+, enable "Unknown Sources" in Settings |
| Want to rebuild | Just run: `eas build --platform android --preview` again |

---

## Tips

✅ Keep the download link - friends can use it multiple times  
✅ Rebuilds take 5-10 minutes each  
✅ Each new build updates the app version  
✅ You can build as many times as you want (free tier)  

---

## Next Steps After Friends Test It

Once friends use it and you get feedback:
1. Make improvements
2. Rebuild APK: `eas build --platform android --preview`
3. Share new link with friends
4. They download & install updated version

---

**You've got this! 💪** Let me know if you get stuck on any step!
