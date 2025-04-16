import React from 'react';

const ChatbotEmbed = () => {
  // Replace this URL with your Render deployment URL
  const renderUrl = "https://test-ai-1-p55a.onrender.com/";
  
  return (
    <div className="chatbot-container">
      <iframe
        src={renderUrl}
        width="100%"
        height="700px"
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}
        title="AI Educational Assistant"
        allow="microphone"
      />
    </div>
  );
};

export default ChatbotEmbed;