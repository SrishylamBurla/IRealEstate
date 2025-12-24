importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBH4tWceXMWqT_Kyb5xmvYuYBQJzJhuQyo",
  projectId: "irealestate-31304",
  messagingSenderId: "209187314054",
  appId: "1:209187314054:web:9be56f227846b3d0677407",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
    }
  );
});
