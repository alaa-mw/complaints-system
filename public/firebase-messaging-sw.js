// Import the functions you need from the Firebase SDK
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyAFm-f9XtYR0pCujvP9QVZ0DVfnFnTTZOw",
  authDomain: "complaintsnoti.firebaseapp.com",
  projectId: "complaintsnoti",
  storageBucket: "complaintsnoti.firebasestorage.app",
  messagingSenderId: "85421615466",
  appId: "1:85421615466:web:bdd2bb54415ea61b2c9d13",
  measurementId: "G-EGLDEM6BM6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging and connect the Service Worker to the app
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,// '/firebase-logo.png' // يمكنك تغيير الأيقونة هنا
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
