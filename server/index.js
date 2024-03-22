const express = require('express')
const app = express()
const server = require('http').createServer(app)
const {Server} = require('socket.io')
const cors = require('cors')

app.use(cors())
app.use(express.json())


const io = new Server(server,{
    cors : {
        origin : "http://localhost:3000",
        methods : ["GET","POST"]
    }
})

server.listen(3001,()=>{
    console.log("Server listening on port 3001");
})


io.on("connection",(socket)=>{
    console.log(`user connected : ${socket.id}`);

 
    socket.on("join_room",(data)=>{
        socket.join(data)
        console.log("User joined Room : "+data);

    })

    socket.on("send_message",(data)=>{
        console.log(data);
        socket.to(data.room).emit("receive_message",data.content)
    })

        socket.on("disconnect",()=>{
            console.log("USER DISCONNECTED");
        })
})