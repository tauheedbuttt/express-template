const cors = require('cors');
const SocketJWT = require('../middlewares/authentication/socket.middleware');

let io;

const onConnect = (socket) => {
    console.log("User Connected: " + socket.id);
    socket.on('disconnect', () => {
        console.log("User Disconnected");
    })
}

const createServer = (app, port, host) => {
    // initialize server with web socket
    const server = require("http").createServer(app);
    io = require('socket.io')(server, {
        cors: { origin: '*' }
    });
    app.set("io", io);

    io.use(cors());

    // Socket.io
    io.of('/api/socket').use(SocketJWT.jwtVerify).on("connection", onConnect);

    // start express app
    server.listen(port, console.log(`Server running at http://${host}:${port}/`))
}

const sendMessage = (socketID, event, message) => io.of('/api/socket').to(socketID).emit(event, message);

module.exports = {
    io,
    createServer,
    sendMessage
}