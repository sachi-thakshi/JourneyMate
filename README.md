# 🗺️ JourneyMate - Mobile Travel Planner

JourneyMate is a professional mobile travel planner and trip organizer built with **React Native (Expo)**. It empowers users to plan trips, manage destinations, and track travel budgets with smart suggestions—all in one place.

---

## 🛠 Tech Stack

* **Frontend:** React Native (Expo) with TypeScript
* **Styling:** NativeWind (Tailwind CSS)
* **Backend:** Firebase Authentication & Cloud Firestore
* **Navigation:** Expo Router (File-based)
* **Build Tool:** Expo Application Services (EAS)
* **Distribution:** Android (APK)

---

## 📋 Prerequisites

Make sure you have the following installed:

* **Node.js:** v18 or higher (LTS recommended)
* **npm:** (Comes with Node.js) or **yarn**
* **Git:** For cloning the repository
* **EAS CLI:** For building APKs (`npm install -g eas-cli`)
* **Expo Go:** Download on your Android device from the Play Store to test in development mode.

---

## 🔐 Key Features

* **Secure Authentication:** User sign-up, login, and profile management powered by **Firebase Auth**.
* **AI-Powered Trip Overviews:** Integration with **Groq AI** to generate automated, intelligent summaries and suggestions for your travel plans.
* **Smart Budgeting & Savings:** A sophisticated budget module where users input their income and personalized savings insights.
* **Cloud-Based Media Storage:** Seamless photo uploads for profile pictures using **Cloudinary**.
* **Full CRUD Operations:** Create, Read, Update, and Delete trips and destinations with real-time synchronization via **Cloud Firestore**.
* **Modern UI/UX:** A high-performance, responsive interface built with **NativeWind (Tailwind CSS)**, featuring a floating navigation bar and custom themes.
* **Full Trip Lifecycle (CRUD):** Users can seamlessly **Create**, **View**, **Update (Edit)**, and **Delete** their trip plans, with all changes instantly synced to **Cloud Firestore**.

---

## 🔥 Firebase Configuration

1. Create a project at [Firebase Console](https://console.firebase.google.com).
2. Enable **Authentication** (Email/Password) and **Cloud Firestore**.
3. Register an Android app with the package name: `com.sachiniimbulagoda.journeymate`.
4. Download the `google-services.json` and place it in your project root.
5. Set up your environment variables in a `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_buckey
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

```
---

## ☁️ Cloudinary Configuration (Image Storage)
JourneyMate uses Cloudinary for storing user profile pictures and trip images. Follow these steps to set up your environment:

1. **Get Cloud Name**: Log in to your [Cloudinary Dashboard](https://cloudinary.com/console) and copy your **Cloud Name**.
2. **Enable Unsigned Uploads**: 
   - Go to **Settings** (Gear Icon) > **Upload**.
   - Scroll to **Upload presets** and click "Enable unsigned uploading".
3. **Create Upload Preset**:
   - Click **Add upload preset**.
   - Set **Signing Mode** to `Unsigned`.
   - Copy the generated **Upload preset name** (e.g., `ml_default`).
4. **Update `.env`**:
   Add these values to your environment variables:

```env
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset_name
```
---

## 🤖 AI Groq Configuration (AI Trip Companion)

JourneyMate uses Groq's high-speed LPU to generate smart trip overviews and itinerary suggestions.

1. **Get API Key**: Sign up at [Groq Cloud Console](https://console.groq.com/).
2. **Create Key**: Navigate to **API Keys** and generate a new key.
3. **Update `.env`**:
   Add the key to your environment variables:

```env
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key
```

## 📦 Installation
1. Clone the repository:

```bash
git clone https://github.com/sachi-thakshi/JourneyMate.git
cd JourneyMate
```

2. Install dependencies:

```bash
npm install
```

## ▶️ Running the App (Development)
Start the Expo development server:

```bash
npx expo start
```
Scan the QR code using the Expo Go app on your Android device.

## 📱 Building Android APK with EAS
1. Login to Expo:
   
```
eas login
```

2. Configure build:
```
eas build:configure
```

3. Run the build:
```
eas build -p android --profile preview --clear-cache
```

## 📥 App Download (APK)
The Android APK is available via GitHub Releases.
👉 **[Download JourneyMate APK](https://github.com/sachi-thakshi/JourneyMate/releases)**









