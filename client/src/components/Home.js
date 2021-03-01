import React, { useState, useEffect } from "react";

import ListChat from "./Conversation/ListChat/ListChat";
import ConversationService from "../services/conversation.service ";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";

function Home() {
  const user = useSelector((user) => user.auth.user);
  const [listConv, setListConv] = useState([]);

  useEffect(() => {
    if (user !== null) {
      ConversationService.getConversation(user.id).then((response) => {
        if (response.status === 200) {
          setListConv(response.data.conversations);
        }
      });
    }
  }, []);

  return user ? (
    <div className="chatRoom">
      <ListChat listConv={listConv} classListChat="listChat on" />
      <div className="chatDetail off">
        <div className="content">
          <div className="xchatContent">XChat</div>
          <div>Chat with friends</div>
        </div>
      </div>
    </div>
  ) : (
    <Redirect to="/login" />
  );
}

export default Home;
