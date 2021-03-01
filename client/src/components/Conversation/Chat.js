import React, { useState, useEffect, useRef } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import Peer from "simple-peer";
import { Howl } from "howler";

import { InfoBar } from "./InfoBar";
import { Input } from "./Input";
import { Messages } from "./Messages/Messages";
import { TextContainer } from "./TextContainer/TextContainer";

import "./conversation.css";
import { useSelector } from "react-redux";
import { getIdRoom } from "../../helper/Helper";
import UserService from "../../services/user.service";
import ListChat from "./ListChat/ListChat";
import MessageService from "../../services/message.service";

import ringtone from "../../sound/ringtone.mp3";
import { DOMAIN } from "../../helper/Const";

import "rodal/lib/rodal.css";

import camera from "../../icons/camera.svg";
import camerastop from "../../icons/camera-stop.svg";
import microphone from "../../icons/microphone.svg";
import microphonestop from "../../icons/microphone-stop.svg";
import hangup from "../../icons/hang-up.svg";
import minimize from "../../icons/minimize.svg";
import fullscreen from "../../icons/fullscreen.svg";
import Rodal from "rodal";

const ringtoneSound = new Howl({
  src: [ringtone],
  loop: true,
  preload: true,
});
// let socket;

function Chat({ location }) {
  const userLogin = useSelector((user) => user.auth.user);
  const partnerId = queryString.parse(location.search).id;
  const [partner, setPartner] = useState({});
  const me = {
    id: userLogin.id,
    username: userLogin.username,
    email: userLogin.email,
  };

  const [offset, setOffset] = useState(1);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [listConv, setListConv] = useState([]);
  const [roomId, setRoomId] = useState("");

  const ENDPOINT = DOMAIN;

  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [callingFriend, setCallingFriend] = useState(false);
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callRejected, setCallRejected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [caller, setCaller] = useState();
  const [isfullscreen, setFullscreen] = useState(false);
  const [block, setBlock] = useState(false);

  const [classContainer, setClassContainer] = useState("callContainer");
  const [classListChat, setClassListChat] = useState("listChat off");
  const [classChatDetail, setClassChatDetail] = useState("chatDetail on");

  const userVideo = useRef();
  const partnerVideo = useRef();
  const myPeer = useRef();
  const socket = useRef();
  useEffect(() => {
    socket.current = io(ENDPOINT);

    let name = me.username;
    let userId = me.id;
    let room = getIdRoom(me.id, partnerId);
    setRoomId(room);

    messages.length = 0;
    UserService.getUserInfo(partnerId).then((response) => {
      if (response.status == 200) {
        setPartner(response.data.user);
      }
    });
    getOldMessages();

    socket.current.emit("join", { name, userId, partnerId, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
    return () => {
      socket.current.disconnect();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.current.on("message", (message) => {
      switch (message.message.type) {
        case 1:
          if (message.message.owner === me.id) {
            setListConv(message.message.list);
          }
          break;
        default:
          setMessages((msgs) => [...msgs, message]);
      }
    });

    socket.current.on("roomData", ({ users }) => {
      setUsers(users);
    });
    socket.current.on("close", () => {
      window.location.reload();
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      ringtoneSound.play();
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.current.emit("sendMessage", message, () => setMessage(""));
    }
  };

  function getOldMessages() {
    MessageService.getMessages(getIdRoom(me.id, partnerId), me.id, offset).then(
      (response) => {
        if (response.status === 200) {
          let data = response.data;
          setMessages([...addToListMessages(data.message), ...messages]);
          setOffset(offset + 1);
        }
      }
    );
  }

  function addToListMessages(msgs) {
    let msg = [];
    for (let i = msgs.length - 1; i >= 0; i--) {
      msg.push({ message: JSON.stringify(msgs[i]) });
    }

    return msg;
  }

  // function outRoom() {
  //   socket.current.emit("disconnect", getIdRoom(me.id, partnerId));
  // }

  //call to partner
  function callPeer() {
    setClassChatDetail("chatDetail off");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        setCallingFriend(true);
        setCaller(partnerId);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        const peer = new Peer({
          initiator: true,
          trickle: false,
          config: {
            iceServers: [
              {
                urls: "stun:numb.viagenie.ca",
                username: "duongnt247@gmail.com",
                credential: "978492740",
              },
            ],
          },
          stream: stream,
        });

        myPeer.current = peer;

        peer.on("signal", (data) => {
          socket.current.emit("callUser", {
            userToCall: partnerId,
            signalData: data,
            from: me.id,
          });
        });

        peer.on("stream", (stream) => {
          if (partnerVideo.current) {
            partnerVideo.current.srcObject = stream;
          }
        });

        peer.on("error", (err) => {
          endCall();
        });

        socket.current.on("callAccepted", (signal) => {
          setCallAccepted(true);
          setClassChatDetail("chatDetail off");
          peer.signal(signal);
        });

        socket.current.on("close", () => {
          window.location.reload();
        });

        socket.current.on("rejected", () => {
          window.location.reload();
        });
      })
      .catch(() => {
        setModalMessage(
          "You cannot place/ receive a call without granting video and audio permissions!"
        );
        setModalVisible(true);
      });
  }

  function acceptCall() {
    ringtoneSound.unload();
    setClassChatDetail("chatDetail off");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        setCallAccepted(true);
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: stream,
        });

        myPeer.current = peer;

        peer.on("signal", (data) => {
          socket.current.emit("acceptCall", { signal: data, to: caller });
        });

        peer.on("stream", (stream) => {
          partnerVideo.current.srcObject = stream;
        });

        peer.on("error", (err) => {
          endCall();
        });

        peer.signal(callerSignal);

        socket.current.on("close", () => {
          window.location.reload();
        });
      })
      .catch(() => {
        setModalMessage(
          "You cannot place/ receive a call without granting video and audio permissions!"
        );
        setModalVisible(true);
      });
  }

  function rejectCall() {
    ringtoneSound.unload();
    setCallRejected(true);
    socket.current.emit("rejected", { to: partnerId });
    window.location.reload();
  }

  function endCall() {
    myPeer.current.destroy();
    socket.current.emit("close", { to: partnerId });
    window.location.reload();
  }

  function toggleMuteAudio() {
    if (stream) {
      setAudioMuted(!audioMuted);
      stream.getAudioTracks()[0].enabled = audioMuted;
    }
  }

  function toggleMuteVideo() {
    if (stream) {
      setVideoMuted(!videoMuted);
      stream.getVideoTracks()[0].enabled = videoMuted;
    }
  }

  function _setModal() {
    setModalVisible(!modalVisible);
  }

  function renderLanding() {
    if (!callRejected && !callAccepted && !callingFriend) return "block";
    return "none";
  }

  function renderCall() {
    if (!callRejected && !callAccepted && !callingFriend) return "none";
    return "block";
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <video className="userVideo" playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <video className="partnerVideo" playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;
  if (receivingCall && !callAccepted && !callRejected) {
    incomingCall = (
      <div className="incomingCallContainer">
        <div className="incomingCall flex flex-column">
          <div>
            <span className="callerID">{partner.username}</span> is calling you!
          </div>
          <div className="incomingCallButtons flex">
            <button
              name="accept"
              className="alertButtonPrimary"
              onClick={acceptCall}
            >
              Accept
            </button>
            <button
              name="reject"
              className="alertButtonSecondary"
              onClick={rejectCall}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  }

  let audioControl;
  if (audioMuted) {
    audioControl = (
      <span className="iconContainer" onClick={toggleMuteAudio}>
        <img src={microphonestop} alt="Unmute audio" />
      </span>
    );
  } else {
    audioControl = (
      <span className="iconContainer" onClick={toggleMuteAudio}>
        <img src={microphone} alt="Mute audio" />
      </span>
    );
  }

  let videoControl;
  if (videoMuted) {
    videoControl = (
      <span className="iconContainer" onClick={toggleMuteVideo}>
        <img src={camerastop} alt="Resume video" />
      </span>
    );
  } else {
    videoControl = (
      <span className="iconContainer" onClick={toggleMuteVideo}>
        <img src={camera} alt="Stop audio" />
      </span>
    );
  }

  let hangUp = (
    <span className="iconContainer" onClick={endCall}>
      <img src={hangup} alt="End call" />
    </span>
  );

  let fullscreenButton;
  if (isfullscreen) {
    fullscreenButton = (
      <span
        className="iconContainer"
        onClick={() => {
          setFullscreen(false);
          setClassContainer("callContainer");
        }}
      >
        <img src={minimize} alt="fullscreen" />
      </span>
    );
  } else {
    fullscreenButton = (
      <span
        className="iconContainer"
        onClick={() => {
          setFullscreen(true);
          setClassContainer("callContainer cover");
        }}
      >
        <img src={fullscreen} alt="fullscreen" />
      </span>
    );
  }

  function changeTabMobile() {
    setClassListChat(
      classListChat == "listChat on" ? "listChat off" : "listChat on"
    );
    setClassChatDetail(
      classChatDetail == "chatDetail on" ? "chatDetail off" : "chatDetail on"
    );
  }

  return (
    <div className="chatRoom">
      <ListChat
        listConv={listConv}
        classListChat={classListChat}
        click={changeTabMobile}
      />
      <div className={classChatDetail}>
        <InfoBar
          userId={me.id}
          blockId={partnerId}
          roomName={partner.username}
          callPeer={callPeer}
          back={changeTabMobile}
          block={block}
          setBlock={setBlock}
        />
        <Messages messages={messages} name={me.username} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          sender={me}
          receive={partner}
          roomId={roomId}
          block={block}
        />
      </div>
      {/* <TextContainer users={users} /> */}
      <>
        <div style={{ display: renderLanding() }}>
          <Rodal
            visible={modalVisible}
            onClose={_setModal}
            width={20}
            height={5}
            measure={"em"}
            closeOnEsc={true}
          >
            <div>{modalMessage}</div>
          </Rodal>
          {incomingCall}
        </div>
        <div className={classContainer} style={{ display: renderCall() }}>
          <div className="partnerVideoContainer">{PartnerVideo}</div>
          <div className="userVideoContainer">{UserVideo}</div>
          <div className="controlsContainer">
            {audioControl}
            {videoControl}
            {fullscreenButton}
            {hangUp}
          </div>
        </div>
      </>
    </div>
  );
}

export default Chat;
