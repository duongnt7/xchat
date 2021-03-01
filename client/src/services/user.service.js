import axios from "axios";
import { DOMAIN } from "../helper/Const";
import authHeader from "./auth-header";

const API_URL = DOMAIN + "api/user/";

class UserService {
  searchUser(username) {
    return axios.get(API_URL + "search?username=" + username, {
      headers: authHeader(),
    });
  }

  getUserInfo(id) {
    return axios.get(API_URL + "getUserInfo?id=" + id, {
      headers: authHeader(),
    });
  }

  updateInfo(id, newUsername, newEmail, password) {
    return axios.get(
      API_URL +
        "updateUserInfo?id=" +
        id +
        "&newUsername=" +
        newUsername +
        "&newEmail=" +
        newEmail +
        "&password=" +
        password,
      {
        headers: authHeader(),
      }
    );
  }

  updatePassword(id, newPassword, rePassword, password) {
    return axios.get(
      API_URL +
        "updateUserPassword?id=" +
        id +
        "&newPassword=" +
        newPassword +
        "&rePassword=" +
        rePassword +
        "&password=" +
        password,
      {
        headers: authHeader(),
      }
    );
  }

  addBlock(userId, blockId, blockName) {
    return axios.get(
      API_URL +
        "addBlock?userId=" +
        userId +
        "&blockId=" +
        blockId +
        "&blockName=" +
        blockName,
      {
        headers: authHeader(),
      }
    );
  }

  unBlock(userId, blockId, blockName) {
    return axios.get(
      API_URL + "unBlock?userId=" + userId + "&blockId=" + blockId,
      {
        headers: authHeader(),
      }
    );
  }
}

export default new UserService();
