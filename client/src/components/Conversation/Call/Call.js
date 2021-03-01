import React from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

import camera from "../../../icons/camera.svg";
import camerastop from "../../../icons/camera-stop.svg";
import microphone from "../../../icons/microphone.svg";
import microphonestop from "../../../icons/microphone-stop.svg";
import hangup from "../../../icons/hang-up.svg";
import fullscreen from "../../../icons/fullscreen.svg";
import minimize from "../../../icons/minimize.svg";

function Call(props) {
  console.log("pn", props.partnerVideo);
  console.log("us", props.userVideo);
  function renderLanding() {
    if (!props.callRejected && !props.callAccepted && !props.callingFriend)
      return "block";
    return "none";
  }

  function renderCall() {
    if (!props.callRejected && !props.allAccepted && !props.callingFriend)
      return "none";
    return "block";
  }

  let UserVideo;
  if (props.stream) {
    UserVideo = (
      <video
        className="userVideo"
        playsInline
        muted
        ref={props.userVideo}
        autoPlay
      />
    );
  }

  let PartnerVideo;
  if (props.callAccepted && props.isfullscreen) {
    PartnerVideo = (
      <video
        className="partnerVideo cover"
        playsInline
        ref={props.partnerVideo}
        autoPlay
      />
    );
  } else if (props.callAccepted && !props.isfullscreen) {
    PartnerVideo = (
      <video
        className="partnerVideo"
        playsInline
        ref={props.partnerVideo}
        autoPlay
      />
    );
  }

  let incomingCall;
  if (props.receivingCall && !props.callAccepted && !props.callRejected) {
    incomingCall = (
      <div className="incomingCallContainer">
        <div className="incomingCall flex flex-column">
          <div>
            <span className="callerID">{props.caller}</span> is calling you!
          </div>
          <div className="incomingCallButtons flex">
            <button
              name="accept"
              className="alertButtonPrimary"
              onClick={props.acceptCall}
            >
              Accept
            </button>
            <button
              name="reject"
              className="alertButtonSecondary"
              onClick={props.rejectCall}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    );
  }

  let audioControl;
  if (props.audioMuted) {
    audioControl = (
      <span className="iconContainer" onClick={props.toggleMuteAudio}>
        <img src={microphonestop} alt="Unmute audio" />
      </span>
    );
  } else {
    audioControl = (
      <span className="iconContainer" onClick={props.toggleMuteAudio}>
        <img src={microphone} alt="Mute audio" />
      </span>
    );
  }

  let videoControl;
  if (props.videoMuted) {
    videoControl = (
      <span className="iconContainer" onClick={props.toggleMuteVideo}>
        <img src={camerastop} alt="Resume video" />
      </span>
    );
  } else {
    videoControl = (
      <span className="iconContainer" onClick={props.toggleMuteVideo}>
        <img src={camera} alt="Stop audio" />
      </span>
    );
  }

  let hangUp = (
    <span className="iconContainer" onClick={props.endCall}>
      <img src={hangup} alt="End call" />
    </span>
  );

  let fullscreenButton;
  if (props.isfullscreen) {
    fullscreenButton = (
      <span className="iconContainer" onClick={props.setFullscreen}>
        <img src={minimize} alt="fullscreen" />
      </span>
    );
  } else {
    fullscreenButton = (
      <span className="iconContainer" onClick={props.setFullscreen}>
        <img src={fullscreen} alt="fullscreen" />
      </span>
    );
  }

  return (
    <>
      <div style={{ display: renderLanding() }}>
        <Rodal
          visible={props.modalVisible}
          onClose={props.setModalVisible}
          width={20}
          height={5}
          measure={"em"}
          closeOnEsc={true}
        >
          <div>{props.modalMessage}</div>
        </Rodal>
        {incomingCall}
      </div>
      <div className="callContainer" style={{ display: renderCall() }}>
        {/* <div className="partnerVideoContainer">{PartnerVideo}</div> */}
        <div className="userVideoContainer">{UserVideo}</div>
        <div className="controlsContainer flex">
          {audioControl}
          {videoControl}
          {fullscreenButton}
          {hangUp}
        </div>
      </div>
    </>
  );
}

export default Call;
