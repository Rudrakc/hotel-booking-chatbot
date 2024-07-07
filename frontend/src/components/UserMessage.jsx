import React from 'react';

function UserMessage({ text }) {
  return (
    <div className="flex justify-end mb-6">
      <div className="bg-[#2f2f2f] text-white p-3 rounded-lg max-w-lg">
        {text}
      </div>
    </div>
  );
}

export default UserMessage;
