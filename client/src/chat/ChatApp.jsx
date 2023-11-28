import { useEffect, useState } from "react";
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Update with your server URL


const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [activity, setActivity] = useState('')
  const [username, setUsername] = useState('')

  useEffect(() => {
    socket.on('usernameAtrib', (myUsername) => {
      setUsername(myUsername)
    })
  // Listen for incoming messages
  socket.on('message', (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  });
    
  let activityTimer   
  socket.on('activity', (name) => {
    setActivity(`${name} is typing`)
    clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
      setActivity('')
    }, 1000)
  })

  // Clean up on component unmount
  return () => {
    socket.disconnect();
  };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault()
    if (messageInput.trim() !== '') {
      socket.emit('message', messageInput);
      setMessageInput('');
    }
  };

  const onChangeHandler = (e) => {
    setMessageInput(e.target.value)
    socket.emit('activity', socket.id.substring(0, 5))
  }


  return (
    <>
      <div className="chatContainer">
        <div className="connectedAs">you are connected as <span className="myself">{username}</span></div>
        <ul>
          {messages.map((msg, index) => (
            <li className={msg.type == "admin" ? "adminMsg" : "userMsg"} key={index}>
              {msg.type == "user" ? <p className={msg.author == username ? "myself" : "other"}>{msg.author + ':'}</p> : ''}
              <p> {msg.body}</p>
            </li>
          ))}
        </ul>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={messageInput}
            onChange={onChangeHandler}
          />       
          <button>Send</button>
        </form>
        <p>{activity}</p>
      </div>
    </>
  )    
}

export default ChatApp