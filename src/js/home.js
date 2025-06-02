import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAiALfYz9QM1Xag5xWOF5ABXGqmaNHDYmg",
    authDomain: "chattime-942c5.firebaseapp.com",
    projectId: "chattime-942c5",
    storageBucket: "chattime-942c5.firebasestorage.app",
    messagingSenderId: "204799191578",
    appId: "1:204799191578:web:899d3b40a3472a1bfd3fa3",
    measurementId: "G-Q1YZCLC7MW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const socket = io();
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatBox = document.getElementById('chatBox');
const onlineUsers = document.getElementById('onlineUsers');
const logoutBtn = document.getElementById('logoutBtn');

let currentUser = null;

onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    socket.emit("user-connected", user.displayName || user.email);
  } else {
    window.location.href = "/src/pages/auth.html";
  }
});

logoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    socket.disconnect();
    window.location.href = "/src/pages/auth.html";
  });
});

chatForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!chatInput.value.trim()) return;

  socket.emit("send-message", {
    user: currentUser.displayName || currentUser.email,
    text: chatInput.value
  });

  chatInput.value = "";
});

socket.on("receive-message", ({ user, text }) => {
  const msg = document.createElement("div");
  msg.className = "bg-gray-800 p-3 rounded-xl";
  msg.innerHTML = `<strong>${user}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on("update-users", (users) => {
  onlineUsers.innerHTML = "";
  users.forEach(u => {
    const li = document.createElement("li");
    li.textContent = u;
    onlineUsers.appendChild(li);
  });
});