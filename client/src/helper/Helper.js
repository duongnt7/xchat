function getIdRoom(firstId, secondId) {
  if (firstId && secondId) {
    if (firstId < secondId) {
      return sliceId(firstId).concat(sliceId(secondId));
    } else {
      return sliceId(secondId).concat(sliceId(firstId));
    }
  }
  return;
}

function sliceId(id) {
  if (id) {
    return id.slice(12, 24);
  }
  return;
}

function checkLogin(code) {
  console.log(code);
  if (code === 401) {
    localStorage.removeItem("user");
    window.location.href("/login");
    return;
  }
  return;
}

function formatTime(time) {
  if (time) {
    return new Date(Number(time)).toLocaleTimeString("vi-VN");
  }
  return;
}

function setLocalStorage(username, email) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    user.username = username;
    user.email = email;
    localStorage.setItem("user", JSON.stringify(user));
    return;
  }
  return;
}

export { getIdRoom, checkLogin, formatTime, setLocalStorage };
