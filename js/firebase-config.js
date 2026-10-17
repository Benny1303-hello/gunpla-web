// Lấy từ Firebase Console > Project settings > Your apps > SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyAF8zRYrtCTJGh0xMHJ2rLsC-15-ohalkg",
  authDomain: "gunpla-f5338.firebaseapp.com",
  projectId: "gunpla-f5338",
  storageBucket: "gunpla-f5338.firebasestorage.app",
  messagingSenderId: "974923548759",
  appId: "1:974923548759:web:379b6c4b68c7797a553b12",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
console.log(firebase.app().name)
