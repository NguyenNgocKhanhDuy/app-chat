// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDtryc4AjzvXckLXn-tmwugEGElp2vc1Ig",
    authDomain: "appchat-82e09.firebaseapp.com",
    projectId: "appchat-82e09",
    storageBucket: "appchat-82e09.appspot.com",
    messagingSenderId: "681093431370",
    appId: "1:681093431370:web:c03c0b835f43805d62a6b3",
    measurementId: "G-Q85Q53JFY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export {storage}

