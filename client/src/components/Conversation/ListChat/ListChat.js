import React, { useState, useEffect } from "react";
import avt from "../../../icons/avt.png";
import { Link } from "react-router-dom";
function ListChat(props) {
  const [itemSelected, setItemSelected] = useState("");

  useEffect(() => {
    let location = window.location.search;
    setItemSelected(location.substring(4, location.length));
  }, [window.location.search]);

  return (
    <div className={props.classListChat}>
      <ul className="listSearch">
        {props.listConv.length > 0
          ? props.listConv.map((data) => {
              return (
                <li
                  key={data.idPartner}
                  className={
                    data.idPartner === itemSelected
                      ? "listSearchItem itemSelected"
                      : "listSearchItem"
                  }
                >
                  <Link to={`/chat?id=${data.idPartner}`}>
                    <div onClick={props.click}>
                      <img src={avt} className="searchAvt" />
                      {data.name}
                    </div>
                  </Link>
                </li>
              );
            })
          : ""}
      </ul>
    </div>
  );
}

export default ListChat;
