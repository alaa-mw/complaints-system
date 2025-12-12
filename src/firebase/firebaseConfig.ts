// // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getToken } from "firebase/messaging";

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
const app = initializeApp(firebaseConfig);
//  بتهيئة خدمة المراسلة
export const messaging = getMessaging(app);


export const getFirebaseToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      const currentToken = await getToken(messaging, 
        { 
          vapidKey:"BFzePq8aI16w-y9Z-UCRzJZFLS_QrXFoMA1olcBED6utZtTwIFRf4fgEUV-DKOPomNSUxEyxiXZIerU2FF_Kj5c"
         });

      if (currentToken) {
        console.log(currentToken);
        return currentToken;
        // يمكنك إرسال الرمز إلى خادمك هنا
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    } else {
      console.log('Unable to get permission to notify.');
    }
  } catch (err) {
    console.error('An error occurred while retrieving token.', err);
  }
};

// getFirebaseToken();

export const getFcmTokenAsString = () => {
  return getFirebaseToken()
    .then((fcm_token) => {
      // The resolved value (string or null) is passed here
      return fcm_token || '';
    })
    .catch((error) => {
      // In case of an error, we return an empty string
      console.error("Error getting FCM token:", error);
      return '';
    });
};