import React from "react";

const ChatPage: React.FC = () => {
  return (
    <div className="chat-page">
      <div className="chat-layout">
        <aside className="chat-sidebar">
          <h3>Spaces</h3>
          <ul>
            <li className="chat-space active">All notes</li>
            <li className="chat-space">DSA</li>
            <li className="chat-space">React / Next</li>
            <li className="chat-space">Job prep</li>
          </ul>
        </aside>
        <section className="chat-main">
          <div className="chat-empty">
            <h2>Talk to your knowledge.</h2>
            <p>
              Ask any question and AI will answer using your notes & documents.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ChatPage;
