import React, { useState, useEffect } from "react";

import onlineIcon from "../../icons/onlineIcon.png";
import backIcon from "../../icons/back-arrow.svg";
import { Button } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import userService from "../../services/user.service";

export const InfoBar = ({
  userId,
  blockId,
  roomName,
  callPeer,
  back,
  block,
  setBlock,
}) => {
  const [loaded, setLoaded] = useState(false);

  function addBlock() {
    userService.addBlock(userId, blockId, roomName).then((res) => {
      if (res.status === 200) {
        setBlock(!block);
      }
    });
  }

  function unBlock() {
    userService.unBlock(userId, blockId).then((res) => {
      if (res.status === 200) {
        setBlock(!block);
      }
    });
  }
  useEffect(() => {
    userService.getUserInfo(userId).then((response) => {
      if (response.status === 200) {
        let listBlock = response.data.user.listBlock;
        if (listBlock) {
          for (let i = 0; i < listBlock.length; i++)
            if (blockId === listBlock[i].blockId) {
              setBlock(true);
              i = listBlock.length;
            }
        }
      }
    });
  });

  return (
    <div className="infoBar">
      <div className="backIcon" onClick={back}>
        <img src={backIcon} alt="back" />
      </div>
      <div className="leftInnerContainer" onClick={() => setLoaded(!loaded)}>
        <img className="onlineIcon" src={onlineIcon} alt="online icon" />
        <h3>{roomName}</h3>
      </div>
      {!block ? (
        <>
          {loaded ? (
            <Button danger onClick={addBlock}>
              Block
            </Button>
          ) : (
            ""
          )}
          <div className="rightInnerContainer" onClick={callPeer}>
            <PhoneOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
          </div>
        </>
      ) : (
        <div className="rightInnerContainer">
          <Button type="primary" onClick={unBlock}>
            Un Block
          </Button>
        </div>
      )}
    </div>
  );
};
