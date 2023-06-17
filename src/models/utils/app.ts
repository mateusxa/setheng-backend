// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getStorage, ref} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAprpJ0YFgf7oCNrKIl4afvNCUv5apxoZc',
  authDomain: 'setheng-2e6c4.firebaseapp.com',
  databaseURL: 'https://setheng-2e6c4-default-rtdb.firebaseio.com',
  projectId: 'setheng-2e6c4',
  storageBucket: 'setheng-2e6c4.appspot.com',
  messagingSenderId: '1099154834904',
  appId: '1:1099154834904:web:fa24a949f4d21739a11ead',
  measurementId: 'G-F42BWGX5VJ',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const storageRef = ref(storage);
export const auth = getAuth(app);
