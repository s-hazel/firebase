import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCNfTqFb7CtCMVyP5OOaPD4BbWfUlX3HHA",
    authDomain: "hc-mhs-tv.firebaseapp.com",
    projectId: "hc-mhs-tv",
    storageBucket: "hc-mhs-tv.appspot.com",
    messagingSenderId: "297111631733",
    appId: "1:297111631733:web:760e3823cffb5e75a9053c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export default app