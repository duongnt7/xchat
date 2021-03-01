import React, { useState } from "react";
import { Input } from "antd";
import SearchResult from "./SearchResult";

const { Search } = Input;

function SearchBox(props) {
  const [key, setKey] = useState("");
  const [focus, setFocus] = useState(false);

  function onSearch(value) {
    setKey(value);
  }

  function _setFocus(value) {
    setTimeout(() => {
      setFocus(value);
    }, 200);
  }

  return (
    <div className="searchBox">
      <Search
        placeholder="Search"
        allowClear
        enterButton="Search"
        size="large"
        onSearch={onSearch}
        onBlur={() => _setFocus(false)}
        onFocus={() => _setFocus(true)}
      />
      {key !== "" && focus ? <SearchResult keyword={key} /> : ""}
    </div>
  );
}

export default SearchBox;
