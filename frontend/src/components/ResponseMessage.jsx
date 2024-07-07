import React from "react";
import ReactMarkdown from "react-markdown";


function ResponseMessage({ text, isLoading }) {
  return (
    <div className="flex justify-start mb-6  rounded-lg ">
      <div className=" text-white p-3 rounded-lg max-w-xl ">
        
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
}

export default ResponseMessage;
