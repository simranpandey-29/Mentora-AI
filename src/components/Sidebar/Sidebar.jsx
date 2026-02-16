import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const [activeItem, setActiveItem] = useState("new");
  const { chatHistory, newChat, loadChatFromHistory } = useContext(Context);

  return (
    <div className={`sidebar ${extended ? "open" : "closed"}`}>
      <div className="top">
        {/* Menu */}
        <div
          className={`recent-entry ${activeItem === "menu" ? "active" : ""}`}
          onClick={() => {
            setExtended((prev) => !prev);
            setActiveItem("menu");
          }}
        >
          <img src={assets.menu_icon} alt="menu" />
          {extended && <p>Menu</p>}
        </div>

        {/* New Chat */}
        {extended && (
          <div
            onClick={() => {
              newChat();
              setActiveItem("new");
            }}
            className={`new-chat ${activeItem === "new" ? "active" : ""}`}
          >
            <img src={assets.plus_icon} alt="new chat" />
            <p>New Chat</p>
          </div>
        )}

        {/* Chat History */}
        {extended && (
          <div className="recent">
            <p className="title">Chat History</p>
            {chatHistory.length === 0 ? (
              <p className="no-chat">No previous chats</p>
            ) : (
              chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    loadChatFromHistory(chat);
                    setActiveItem(chat.id);
                  }}
                  className={`recent-entry ${
                    activeItem === chat.id ? "active" : ""
                  }`}
                >
                  <img src={assets.message_icon} alt="chat" />
                  <p>{chat.title.slice(0, 18)}...</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom */}
      {extended && (
        <div className="bottom">
          <div
            onClick={() => setActiveItem("help")}
            className={`bottom-item ${activeItem === "help" ? "active" : ""}`}
          >
            <img src={assets.question_icon} alt="help" />
            <p>Help</p>
          </div>

          <div
            onClick={() => setActiveItem("activity")}
            className={`bottom-item ${activeItem === "activity" ? "active" : ""}`}
          >
            <img src={assets.history_icon} alt="activity" />
            <p>Activity</p>
          </div>

          <div
            onClick={() => setActiveItem("settings")}
            className={`bottom-item ${activeItem === "settings" ? "active" : ""}`}
          >
            <img src={assets.setting_icon} alt="settings" />
            <p>Settings</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
