const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://127.0.0.1:5173" },
});

//impostazioni partita server
let interval;
let impostazioniPartita;
let lobby;
let numeriCartella;
let numeriGiaEstratti;

function init() {
  impostazioniPartita = null;
  lobby = [];
  numeriCartella = [];
  numeriGiaEstratti = [];
  for (let i = 0; i < 90; i++) {
    numeriGiaEstratti[i] = i;
    numeriCartella[i] = i;
  }
  console.log("tutto reimpostato");
}

init();

io.on("connection", (socket) => {
  socket.on("crea-lobby", (gameSettings, username) => {
    if (impostazioniPartita == null) {
      gameSettings.owner = socket.id;
      impostazioniPartita = gameSettings;
      socket.join("partita");
      lobby.push({ username, socketId: socket.id });
      console.log(
        "lobby creata correttamente, impostazioni:",
        impostazioniPartita
      );
    } else {
      console.log("partita gìa creata");
      socket.emit(
        "lobbyPiena",
        "È già presente una partita! Usa il bottone join lobby"
      );
    }
  });

  socket.on("join-lobby", (username) => {
    if (
      impostazioniPartita != null &&
      impostazioniPartita.giocatori != lobby.length
    ) {
      socket.join("partita");
      lobby.push({ username, socketId: socket.id });
      socket.emit("done", impostazioniPartita);
      console.log(`${username} è entrato nella lobby`);
    } else {
      console.log("errore, lobby piena!");
      socket.emit("lobbyPiena", "la lobby è piena");
    }
  });

  socket.on("genera-scheda", async () => {
    const sockets = await io.in("partita").fetchSockets();
    sockets.forEach((s) => {
      let cartella = [[], [], []];
      cartella.forEach((arr) => {
        for (let i = 0; i < 9; i++) {
          arr[i] = {
            numero: Math.floor(Math.random() * 90),
            estratto: false,
          };
        }
      });
      s.emit("scheda-generata", cartella);
    });
    console.log("tutte le schede sono state generate con successo!");
  });

  socket.on("game-start", () => {
    if (numeriGiaEstratti.length != 0) {
      console.log("partita iniziata correttamente");
      interval = setInterval(() => {
        if (numeriGiaEstratti.length != 0) {
          let index = Math.floor(Math.random() * numeriGiaEstratti.length);
          let numeroEstratto = numeriGiaEstratti[index];
          numeriGiaEstratti.splice(index, 1);
          io.to("partita").emit("numero-estratto", numeroEstratto);
        }
      }, 500);
    }
  });
  socket.on("ambo-fatto", (username, n1, n2) => {
    console.log(
      `attenzione il giocatore ${username} ha fatto ambo con i numeri ${n1},${n2}!`
    );
    socket.broadcast.emit(
      "ambo",
      `attenzione il giocatore ${username} ha fatto ambo con i numeri ${n1},${n2}!`
    );
  });
  socket.on("fine-gioco", (username) => {
    clearInterval(interval);
    socket.broadcast.emit("vincitore", username);
    io.in("partita").disconnectSockets(true);
    console.log(`partita finita correttamente, il vincitore è ${username}`);
    init();
  });
});

app.get("/getUser", (req, res) => {
  res.status(200).json(lobby);
});

app.get("/reset", (req, res) => {
  init();
  res.send("tutto resettato");
});

httpServer.listen(3000);
