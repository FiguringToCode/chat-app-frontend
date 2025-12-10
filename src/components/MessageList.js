import React from "react";
import { formatDistanceToNow } from 'date-fns'
import { TiTick } from "react-icons/ti";

const MessageList = ({ messages, user, typingUsers, currentChat }) => {

  const formatTimestamp = (createdAt) => {
    if (!createdAt) return <TiTick /> 

    try {
      return formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    } catch (error) {
      return "Just now"
    }
  }

  return (
    <div className="d-flex flex-column gap-3">
      {messages?.map((msg, index) => {
        const isSent = msg.sender === user.username;
        const timestamp = formatTimestamp(msg.createdAt)
        
        return (
          <div key={msg._id}
            // Alignment for sent/received
            className={`d-flex ${isSent ? "justify-content-end" : "justify-content-start"}`}>
            {/* The Message Bubble */}
            <div className={`p-2 rounded-3 shadow-sm ${
                isSent ? "bg-primary text-white" : "bg-light text-dark"}`}
              style={{ maxWidth: "70%" }}>
              {/* Optional: Show sender name only for received messages */}
              {!isSent && (
                  <strong className="d-block small fw-bold">
                    <p className="m-0">{msg?.sender}</p>
                  </strong>
              )}
              
              <p className="mb-2">{msg?.message}</p>
              <div className="d-flex justify-content-between align-items-center small opacity-75 "> 
                  <span>{timestamp}</span>
                  {isSent && (
                    <span className="me-1">
                      {msg.status === 'read' && <i className="bi bi-check-all-fill text-info"></i>}
                      {msg.status === 'delivered' && <i className="bi bi-check-all"></i>}
                      {msg.status === 'sent' && <i className="bi bi-check-lg"></i>}
                    </span>
                  )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {typingUsers?.[currentChat] && (
        <div className="text-muted small fst-italic p-2 d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-1" style={{ width: '1rem', height: '1rem' }}></div>
          <span>{typingUsers[currentChat]} is typing...</span>
        </div>
      )}
    </div>
  );
};

export default MessageList;