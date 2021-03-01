import React, { useState } from "react";

import ReactEmoji from "react-emoji";
import { formatTime } from "../../../../helper/Helper";

import "./Message.css";

export const Message = ({ message, name }) => {
  const username = message.sender.username;
  const [showTime, setShowTime] = useState(false);

  function _showTime() {
    setShowTime(!showTime);
  }

  return username === name ? (
    <div className="messageContainer justifyEnd">
      {showTime ? (
        <p className="sentText pr-10">{formatTime(message.time)}</p>
      ) : (
        ""
      )}
      <div className="messageBox backgroundBlue" onClick={_showTime}>
        <p className="messageText colorWhite">
          {ReactEmoji.emojify(message.text)}
        </p>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight" onClick={_showTime}>
        <p className="messageText colorDark">{message.text}</p>
      </div>
      {showTime ? (
        <p className="sentText pl-10">{formatTime(message.time)}</p>
      ) : (
        ""
      )}
    </div>
  );
};
