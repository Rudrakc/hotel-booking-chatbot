import React, { useState, useRef, useEffect } from "react";
import UserMessage from "./UserMessage";
import ResponseMessage from "./ResponseMessage";
import MessageInput from "./MessageInput";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      type: "response",
      text: "Welcome to our hotel booking service! Whether you're planning a relaxing getaway or a business trip, I'm here to assist you in finding the perfect accommodations. Let's get started! How can I help you today?",
    },
  ]);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (message) => {
    setMessages([...messages, { type: "user", text: message }]);
    setLoading(true);

    const requestData = {
      message: message,
      userId: 1,
    };

    // Send the message to the backend
    fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLoading(false);
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "response", text: data },
        ]);
      })
      .catch((error) => {
        console.error("Error sending message to backend:", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#212121] text-white">
      <div className="w-[60%] h-full p-4">
        <div className="flex flex-col my-6 max-h-[700px] min-h-[700px] w-full overflow-y-auto p-4 rounded-lg scrollbar-hide ">
          {messages.map((msg, index) =>
            msg.type === "user" ? (
              <UserMessage key={index} text={msg.text} />
            ) : (
              <ResponseMessage
                key={index}
                text={msg.text}
                isLoading={loading}
              />
            )
          )}
          {loading ? (
            <SkeletonTheme baseColor="#202020" highlightColor="#444">
              <Skeleton className="h-28 p-3 rounded-lg max-w-xl" />
            </SkeletonTheme>
          ) : null}
          <div ref={messagesEndRef} />
        </div>
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}

export default ChatWindow;
