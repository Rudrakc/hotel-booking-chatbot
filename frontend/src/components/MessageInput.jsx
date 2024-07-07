import React, { useState } from "react";
import { LightBulbIcon } from "@heroicons/react/solid";
import { ArrowUpIcon } from "@heroicons/react/solid";

function MessageInput({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    onSend(message);
    setMessage("");
  };

  return (
    <div className="flex items-center bg-[#2f2f2f] rounded-full px-6 py-5 ">
      <LightBulbIcon className="h-5 w-5 text-white mx-1" />
      <input
        type="text"
        value={message}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
        className="bg-[#2f2f2f] text-white placeholder-gray-500 flex-grow px-4 focus:outline-none"
      />
      <button onClick={handleSend}>
        <ArrowUpIcon className="h-5 w-5 text-gray-400" />
      </button>
    </div>
  );
}

export default MessageInput;
