import React from "react";

import ScrollToBottom from "react-scroll-to-bottom";

import { Message } from "./Message/Message";

import "./Messages.css";

export const Messages = ({ messages, name }) => {
  return (
    <ScrollToBottom className="messages">
      {messages.length > 0
        ? messages.map((message, i) => (
            <div key={i}>
              <Message message={JSON.parse(message.message)} name={name} />
            </div>
          ))
        : ""}
    </ScrollToBottom>
  );
};
