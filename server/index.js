import express from 'express';
import http from 'http';
import { Server } from 'socket.io';


const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});



let auctionState = {
    currentParticipant: 1,
    participants: [
        { id: 1, price: 3700000 },
        { id: 2, price: 3200000 },
        { id: 3, price: 2800000 },
        { id: 4, price: 2500000 },
    ],
    isStarted: false,
    auctionTimer: 900,
    turnTimer: 30,
};

let auctionInterval;
let turnInterval;

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);


    socket.emit('auctionUpdate', auctionState);


    socket.on('updatePrice', ({ participantId, newPrice }) => {
        auctionState.participants = auctionState.participants.map((p) =>
            p.id === participantId ? { ...p, price: newPrice } : p
        );
        io.emit('auctionUpdate', auctionState);
    });


    socket.on('nextTurn', () => {
        auctionState.currentParticipant =
            (auctionState.currentParticipant % auctionState.participants.length) + 1;
        auctionState.turnTimer = 30;
        io.emit('auctionUpdate', auctionState);
    });


    socket.on('startAuction', () => {
        if (!auctionState.isStarted) {
            auctionState.isStarted = true;
            auctionState.auctionTimer = 900;
            auctionState.turnTimer = 30;


            auctionInterval = setInterval(() => {
                if (auctionState.auctionTimer > 0) {
                    auctionState.auctionTimer -= 1;
                } else {
                    clearInterval(auctionInterval);
                    clearInterval(turnInterval);
                    auctionState.isStarted = false;
                    io.emit('auctionUpdate', auctionState);
                }
                io.emit('auctionUpdate', auctionState);
            }, 1000);


            turnInterval = setInterval(() => {
                if (auctionState.turnTimer > 0) {
                    auctionState.turnTimer -= 1;
                } else {

                    auctionState.currentParticipant =
                        (auctionState.currentParticipant % auctionState.participants.length) + 1;
                    auctionState.turnTimer = 30;
                }
                io.emit('auctionUpdate', auctionState);
            }, 1000);

            io.emit('auctionUpdate', auctionState);
        }
    });


    socket.on('endAuction', () => {
        auctionState.isStarted = false;
        clearInterval(auctionInterval);
        clearInterval(turnInterval);
        io.emit('auctionUpdate', auctionState);
    });
});

server.listen(4000, () => console.log('Server running on port 4000'));
