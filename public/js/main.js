const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

// GET username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll donw
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // get message text
  const msg = e.target.elements.msg.value;

  //  Emit msg to server
  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Outpust message to DOM
function outputMessage(message) {
  const something = document.createElement("div");
  something.classList.add("message");
  something.innerHTML += `  <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
   ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(something);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  usersList.innerHTML = `
    ${users
      .map(
        (user) => `
    <li>${user.username}</li>
    `
      )
      .join("")}
  `;
}
