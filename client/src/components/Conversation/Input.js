import React from "react";

import "font-awesome/css/font-awesome.min.css";

export const Input = ({
  message,
  setMessage,
  sendMessage,
  sender,
  receive,
  roomId,
  block,
}) => {
  const setMes = (e) => {
    setMessage(
      JSON.stringify({
        sender: sender,
        receive: receive,
        text: e.target.value,
        roomId: roomId,
        time: new Date().getTime(),
      })
    );
  };

  return !block ? (
    <form className="form">
      <input
        className="input"
        type="text"
        placeholder="Type a message..."
        value={message ? JSON.parse(message).text : ""}
        onChange={(e) => setMes(e)}
        onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
      />
      <button className="sendButton" onClick={(e) => sendMessage(e)}>
        <div>
          <i className="fa fa-paper-plane" />
        </div>
      </button>
    </form>
  ) : (
    <div
      style={{
        height: "45px",
        textAlign: "center",
        background: "#e0e0e0",
        padding: "10px",
      }}
    >
      You cannot chat with this user!
    </div>
  );
};
