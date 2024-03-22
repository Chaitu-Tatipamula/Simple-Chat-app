import './App.css';
import {useState,useEffect} from 'react'
import io from 'socket.io-client'
import ScrollToBottom from 'react-scroll-to-bottom'
let socket
const CONNECTION_PORT = "http://localhost:3001/"

function App() {
  // Before
  const [loggedIn, setLoggedIn] = useState(false)
  const [room,setRoom] = useState('')
  const [userName,setUserName] = useState('')

   // After 
   const [message,setMessage] = useState('')
   const [messageList,setMessageList] = useState([])
  
  useEffect(() => {
      socket = io(CONNECTION_PORT)
  }, [CONNECTION_PORT])

  useEffect(()=>{
    socket.on("receive_message",(data)=>{
      setMessageList([...messageList,data])
    })
  })

  const connectRoom = ()=>{
    setLoggedIn(true)
    socket.emit('join_room',room)
  }

  const sendMessage = ()=>{
    let messageContent = {
        room : room,
        content :{
            author :  userName,
            message : message,
            time : new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
        }
    }
    socket.emit('send_message',messageContent)
    setMessageList([...messageList,messageContent.content])
    setMessage('')
  }

  
  return (
    <div className="App">
      {!loggedIn?(
      <div className='login'>
        <div className='inputs'>
          <input type='text' placeholder='Enter your Name' onChange={(e)=>setUserName(e.target.value)}/>
          <input type='text' placeholder='Enter room name' onChange={(e)=>setRoom(e.target.value)}/>
        </div>
        <button onClick={connectRoom}>Enter chat</button>
      </div>
      ):(
      <div className='chatContainer'>
        <ScrollToBottom className='message-container'>
        <div className='messages'>
          {messageList.map((val,key)=>(
            <div className='messageBubble' id={val.author == userName ? "You" : "Other"}>
              <div className="message">{val.author} : {val.message} </div>
              <div className='time'>{val.time}</div>
            </div>
          ))}
        </div>
        </ScrollToBottom>
        <div className='messageInputs'>
            <input type='text' placeholder='message' onChange={(e)=>setMessage(e.target.value)}/>
            <button onClick={sendMessage}>Send</button>
        </div>
    </div>
      )}
    </div>
  );
}

export default App;
