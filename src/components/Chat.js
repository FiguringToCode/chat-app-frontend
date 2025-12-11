import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import MessageList from "./MessageList";
import InputEmoji from 'react-input-emoji'


const socket = io("https://chat-app-backend-ao7g.onrender.com");

export const Chat = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState({})
  const [typingTimer, setTypingTimer] = useState(null)

  // FIX: MessageList needs the current user object, not the users array
  const currentUserObj = { username: user.username };

  useEffect(() => {
    // Fetch all users excluding the current user
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("https://chat-app-backend-ao7g.onrender.com/users", {
          params: { currentUser: user.username },
        });
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };

    fetchUsers();

    socket.emit("join_chat", user.username)

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      if (data.sender === currentChat) {
        setMessages((prev) => [...prev, { ...data, status: 'delivered' }]);
      }
    });

    socket.on("message_sent", (data) => {
      if(data.receiver === currentChat){
        setMessages(prev => prev.map(msg => !msg._id && msg.message === data.message ? {...data, status: 'delivered'} : msg))
      }
    })

    socket.on("user_typing", (data) => {
      if(data.receiver === user.username && data.username === currentChat){
        setTypingUsers(prev => ({ ...prev, [data.username]: data.username}))
      }
    })

    socket.on("user_stop_typing", (data) => {
      if(data.receiver === user.username && data.sender === currentChat) {
        setTypingUsers(prev => {
          const newTyping = { ...prev }
          delete newTyping[data.sender]
          return newTyping
        })
      }
    })

    socket.on("message_delivered", (data) => {
      if(data.sender === user.username){
        setMessages(prev => prev.map(msg => 
          msg._id === data.messageId ? { ...msg, status: 'delivered' } : msg
        ))
      }
    })

    socket.on("message_read", (data) => {
      if(data.sender === user.username){
        setMessages(prev => prev.map(msg => 
          msg._id === data.messageId ? { ...msg, status: 'read' } : msg
        ))
      }
    })


    return () => {
      socket.off("receive_message");
      socket.off("message_sent")
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("message_delivered");
      socket.off("message_read");
    };
  }, [currentChat, user.username]);

  const fetchMessages = async (receiver) => {
    try {
      const { data } = await axios.get("https://chat-app-backend-ao7g.onrender.com/message", {
        params: { sender: user.username, receiver },
      });
      setMessages(data);
      setCurrentChat(receiver);
    } catch (error) {
      console.error("Error fetching messages", error.message);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const messageData = {
      sender: user.username,
      receiver: currentChat,
      message: currentMessage.trim(),
      status: 'sent'
    };

    
    // Optimistic update
    const tempId = Date.now().toString()
    const optimisticMsg = { ...messageData, _id: tempId }
    setMessages(prev => [...prev, optimisticMsg])

    try {
      socket.emit("send_message", messageData)
      setCurrentMessage("")
      if (typingTimer) {
        clearTimeout(typingTimer)
        setTypingTimer(null)
      }
    } catch (error) {
      console.error("Send failed: ", error)
    }
    
  };

  const handleTyping = (value) => {
    setCurrentMessage(value)

    if(currentChat){
      // Clear previous timer
      if (typingTimer) clearTimeout(typingTimer)

      // Emit typing
      socket.emit("typing", { sender: user.username, receiver: currentChat })

      const timer = setTimeout(() => {
        socket.emit("stop_typing", { sender: user.username, receiver: currentChat })
      }, 3500)
      setTypingTimer(timer)
    }
  }


  return (
    // Main chat container: Dark card spanning most of the viewport
    <div className="container p-0 shadow-lg" style={{ height: "80vh", maxWidth: "1200px" }}>
      <div className="d-flex h-100 rounded overflow-hidden">
        
        {/* Chat List (Sidebar) */}
        <div className="col-4 col-md-3 bg-dark p-2 border-end border-secondary d-flex flex-column">
          <div className="p-3 border-bottom border-secondary">
            <h5 className="mb-0 text-white-50">Chats</h5>
            <small className="text-success">Logged in as: {user.username}</small>
          </div>
          
          <div className="list-group list-group-flush flex-grow-1">
            {users.length === 0 && (
              <p className="p-3 text-secondary">No other users found.</p>
            )}
            {users.map((u) => (
              <button
                key={u._id}
                className={`list-group-item list-group-item-action border-secondary text-light 
                  ${currentChat === u.username ? "bg-primary text-white" : "bg-dark"} `}
                onClick={() => fetchMessages(u.username)}>
                {u.username}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="col-8 col-md-9 bg-secondary d-flex flex-column">
          {!currentChat ? (
            <div className="d-flex justify-content-center align-items-center h-100 text-muted">
              <h4 className="text-center">👈 Select a user to start chatting.</h4>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-3 bg-dark border-bottom border-secondary">
                <h5 className="mb-0 text-white">Chatting with: <span className="fw-bold text-success">{currentChat}</span></h5>
              </div>

              {/* Message Area */}
              <div className="flex-grow-1 overflow-auto p-3" style={{ background: "#212529" }}>
                {/* Passing currentUserObj, which correctly contains the username for MessageList */}
                <MessageList messages={messages} user={currentUserObj} typingUsers={typingUsers} currentChat={currentChat} /> 
              </div>

              {/* Message Input Field (Form) */}
              <form onSubmit={sendMessage} className="p-3 border-top border-secondary bg-dark d-flex gap-2">
                <InputEmoji
                  type="text"
                  placeholder="Type a message..."
                  value={currentMessage}
                  cleanOnEnter
                  onEnter={sendMessage}
                  theme="dark"
                  height={52}
                  fontSize={15}
                  borderColor="#6c757d"
                  background="#343a40"
                  color="white"
                  className="form-control bg-black text-white"
                  onChange={handleTyping}
                />
                <button type="submit" className="btn btn-success fw-bold px-3">
                  Send <i className="bi bi-send-fill"></i>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};