import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyCWMFP2xRFli2Adb4BIft7z1-6X7rjAqT0",
  authDomain: "everything-party.firebaseapp.com",
  databaseURL: "https://everything-party.firebaseio.com",
  projectId: "everything-party",
  storageBucket: "everything-party.appspot.com",
  messagingSenderId: "477511521845",
  appId: "1:477511521845:web:a71b39627a2e72a698c37c",
  measurementId: "G-18LRSZBXRT"
};

export const initializeFirebase = () => {
  firebase.initializeApp(firebaseConfig);
}
