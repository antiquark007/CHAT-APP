import {Server} from 'socket.io';
import http from 'http';
import express from 'express';
import { Socket } from 'dgram';

const app = express();
const server = http.createServer(app);

const io= new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
    }
});

//incoming connections
io.on("connection",(socket)=>{
    console.log("user connected",socket.id);


    socket.on("disconnect",()=>{
        console.log("A user is disconnected",socket.id)
    })

})

export {io,app,server};