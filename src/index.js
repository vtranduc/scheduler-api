const PORT = process.env.PORT || 3001;
const ENV = require("./environment");

const app = require("./application")(ENV, { updateAppointment });
const server = require("http").Server(app);

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

wss.on("connection", socket => {
  console.log('connection established')
  socket.onmessage = event => {

    if (event.data === "ping") {
      socket.send(JSON.stringify("pong"));
      console.log('server has requested');
    }
  };
});


function updateAppointment(id, interview) {
  wss.clients.forEach(function eachClient(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: "SET_INTERVIEW",
          id,
          interview
        })
      );
    }
  });
}

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} in ${ENV} mode.`);
});
