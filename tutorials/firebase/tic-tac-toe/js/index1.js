// js/index1.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, update } from "firebase/database";

const firebaseConfig = {
    // IMPORTANT: Replace this with your own Firebase config from Project Settings -> SDK setup for web
    apiKey: "AIzaSyAOQeReL7V3h5LtGC141xX2NtA82p9InHM",
    authDomain: "tic-tac-toe-network-v1-0-js.firebaseapp.com",
    databaseURL: "https://tic-tac-toe-network-v1-0-js-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tic-tac-toe-network-v1-0-js",
    storageBucket: "tic-tac-toe-network-v1-0-js.firebasestorage.app",
    messagingSenderId: "966053462012",
    appId: "1:966053462012:web:5495e05cd7220d7992bc79",
    measurementId: "G-4H2WE6VF8L"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Game state
const gameId = "game1"; // demo — a single shared game
const gameRef = ref(db, "games/" + gameId);

const boardDiv = document.getElementById("board");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart");

// Generate a simple unique id for this client
const myId = "player-" + Date.now();
let myPlayer = null;

// Initialize board UI
const cells = [];
for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => makeMove(i));
    boardDiv.appendChild(cell);
    cells.push(cell);
}

// Initialize game in RTDB if not exists
async function initGame() {
    const snapshot = await get(gameRef);
    if (!snapshot.exists()) {
        await set(gameRef, {
            board: ["", "", "", "", "", "", "", "", ""],
            turn: "X",
            winner: null
        });
    }
}

await initGame();

// Join game
async function joinGame() {
    const snapshot = await get(gameRef);
    const data = snapshot.val() || {};

    if (!data.playerX) {
        myPlayer = "X";
        await update(gameRef, { playerX: myId });
    } else if (!data.playerO) {
        myPlayer = "O";
        await update(gameRef, { playerO: myId });
    } else {
        alert("Game is full");
    }
}

await joinGame();

restartBtn.addEventListener("click", async () => {
    await set(gameRef, {
        board: ["", "", "", "", "", "", "", "", ""],
        turn: "X",
        winner: null
    });
});

// Listen to game changes
onValue(gameRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    data.board.forEach((v, i) => cells[i].textContent = v);
    if (data.winner) {
        status.textContent = data.winner === "Draw" ? "Draw!" : `Winner: ${data.winner}`;
    } else {
        status.textContent = `Turn: ${data.turn}`;
    }
});

// Make a move
async function makeMove(index) {
    const snapshot = await get(gameRef);
    const data = snapshot.val();
    if (!data || data.winner) return;

    // Only current player can move
    if (data.turn !== myPlayer) return;

    // Check if cell is empty
    if (data.board[index] !== "") return;

    // Make move
    const newBoard = [...data.board];
    newBoard[index] = data.turn;

    // Check winner
    const winner = checkWinner(newBoard);

    // Update database
    await update(gameRef, {
        board: newBoard,
        turn: data.turn === "X" ? "O" : "X",
        winner: winner
    });
}

// Check winner
function checkWinner(b) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // cols
        [0, 4, 8],
        [2, 4, 6] // diagonals
    ];

    for (const [a, b1, c] of lines) {
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return b.includes("") ? null : "Draw";
}
