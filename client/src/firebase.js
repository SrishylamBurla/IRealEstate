import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBH4tWceXMWqT_Kyb5xmvYuYBQJzJhuQyo",
  authDomain: "irealestate-31304.firebaseapp.com",
  projectId: "irealestate-31304",
  messagingSenderId: "209187314054",
  appId: "1:209187314054:web:9be56f227846b3d0677407",
};

const app = initializeApp(firebaseConfig);
// export const messaging = getMessaging(app);

export const getFirebaseMessaging = () => {
  if (typeof window === "undefined") return null;

  return getMessaging(app);
};
export { getToken, onMessage };
