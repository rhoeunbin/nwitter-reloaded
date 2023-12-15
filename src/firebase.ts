import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBf3bpluirHZ9T_Bhr0mOuYb_Tk4bI5H-s",
  authDomain: "ntwitter-d15e8.firebaseapp.com",
  projectId: "ntwitter-d15e8",
  storageBucket: "ntwitter-d15e8.appspot.com",
  messagingSenderId: "280091227668",
  appId: "1:280091227668:web:3b69b88d7fee838cc85901",
};

const app = initializeApp(firebaseConfig); // config 옵션을 통해 app 생성

export const auth = getAuth(app); // app에 대한 인증을 사용하고 싶다

export const storage = getStorage(app);

export const db = getFirestore(app);
