const cors = require('cors');
const SocketJWT = require('../middlewares/authentication/socket.middleware');
const Device = require('../models/Device');

let io;

const updateDevice = async (data) => {
    const updated = await Device.findOneAndUpdate(
        { user: data.user, device: data.device },
        { ...data },
        { new: true }
    );
    if (!updated) await Device.create(data)
}

const onConnect = (socket) => {
    const { device, name, fcm, os } = socket.handshake?.query;

    updateDevice({
        user: socket.user._id,
        device,
        os,
        fcm,
        name,
        socket: socket.id
    })

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

const sendUserMessage = async (user, event, message) => {
    const devices = await Device.find({ user });
    devices.forEach(device => {
        sendMessage(device.socket, event, message)
    })
}

module.exports = {
    io,
    createServer,
    sendMessage,
    sendUserMessage
}