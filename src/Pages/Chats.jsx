import React from "react";
import "../css/Chats.css";

const chatThreads = [
  {
    id: 1,
    name: "Photography Club",
    lastMessage: "Admin: Quick update: we’re putting together a small exhibition of student photos next month - we’ll share details on how to enter soon.Let's lock the Q image today.",
    time: "14:05",
    unread: 3,
  },
  {
    id: 2,
    name: "Basketball Club",
    lastMessage: "Let's go.",
    time: "13:12",
    unread: 0,
  },
  {
    id: 3,
    name: "Running Club",
    lastMessage: "Should we meet after running?",
    time: "09:42",
    unread: 1,
  },
  {
    id: 4,
    name: "Chess Club",
    lastMessage: "When's our next meetup?",
    time: "Yesterday",
    unread: 0,
  },
];

const sampleMessages = [
  { id: 1, author: "other", text: "Hey! Ready for tonight's club meetup?" },
  { id: 2, author: "admin", text: "Quick update: we're putting together a small exhibition of student photos next month - we'll share details on how to enter soon." },
  { id: 3, author: "other", text: "That sounds amazing! When is it?" },
  { id: 4, author: "admin", text: "We're aiming for late February. More details coming next week!" },
  { id: 5, author: "me", text: "Count me in, I have some shots to contribute." },
];

export default function Chats() {
  return (
    <div className="chats-page">
      <aside className="threads-panel">
        <header className="panel-header">
          <div>
            <div className="panel-title">Chats</div>
            <div className="panel-sub">You have 4 active threads</div>
          </div>
          <div className="presence-dot" aria-label="Online" />
        </header>

        <div className="search-box" role="search">
          <input placeholder="Search chats" />
        </div>

        <ul className="thread-list">
          {chatThreads.map((thread) => (
            <li key={thread.id} className="thread-item">
              <div className="avatar" aria-hidden="true">
                {thread.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="thread-meta">
                <div className="thread-top">
                  <span className="thread-name">{thread.name}</span>
                  <span className="thread-time">{thread.time}</span>
                </div>
                <div className="thread-bottom">
                  <span className="thread-last">{thread.lastMessage}</span>
                  {thread.unread > 0 && (
                    <span className="unread-pill">{thread.unread}</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <section className="chat-area">
        <header className="chat-header">
          <div className="chat-peer">
            <div className="avatar" aria-hidden="true">
              DS
            </div>
            <div>
              <div className="peer-name">Photography Club</div>
              <div className="peer-status">Online • 8 members</div>
            </div>
          </div>
        </header>

        <div className="messages" role="log" aria-live="polite">
          {sampleMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bubble ${msg.author === "me" ? "me" : "other"}`}
            >
              {msg.author === "admin" && <div className="message-author">admin</div>}
              {msg.text}
            </div>
          ))}
        </div>

        <div className="composer" role="form" aria-label="Message input">
          <input placeholder="Type a message" />
          <button className="send-btn">Send</button>
        </div>
      </section>
    </div>
  );
}
