import React from "react";

import onlineIcon from "../../../icons/onlineIcon.png";

import "./TextContainer.css";

export const TextContainer = ({ users }) => (
  <div className="textContainer">
    <div>
      <h1>Online</h1>
      <div className="activeContainer">
        {users ? (
          <h2>
            {users.map(({ name }) => (
              <div key={name} className="activeItem">
                {name}
                <img alt="Online Icon" src={onlineIcon} />
              </div>
            ))}
          </h2>
        ) : null}
      </div>
    </div>
  </div>
);
