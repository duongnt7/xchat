import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import UserService from "../../services/user.service";
import Loading from "../Loading";

import avt from "../../icons/avt.png";

function SearchResult(props) {
  const [loaded, setLoaded] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    UserService.searchUser(props.keyword).then((response) => {
      setResults(response.data.users);
      setLoaded(true);
    });
  }, [props.keyword]);

  return (
    <ul className="listSearch">
      {loaded ? (
        results && results.length > 0 ? (
          results.map((data) => {
            return (
              <li key={data._id} className="listSearchItem">
                <Link to={`/chat?id=${data._id}`}>
                  <div>
                    <img src={avt} className="searchAvt" alt={data.username} />
                    {data.username}
                  </div>
                </Link>
              </li>
            );
          })
        ) : (
          <h3>No sesult</h3>
        )
      ) : (
        <Loading />
      )}
    </ul>
  );
}

export default SearchResult;
