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

  const sendMessage = () => {
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
      <div>
        <p>you are connected as {username}</p>
        <ul>
          {messages.map((msg, index) => (
            <li className={msg.type == "admin" ? "adminMsg" : "userMsg"} key={index}>
              {msg.type == "user" ? <p className={msg.author == username ? "myself" : "other"}>{msg.author + ':'}</p> : ''}
              <p> {msg.body}</p>
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={messageInput}
          onChange={onChangeHandler}
        />
        <button onClick={sendMessage}>Send</button>
        <p>{activity}</p>
      </div>
    </>
  )    
}

export default ChatApp