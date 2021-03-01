import axios from "axios";
import { DOMAIN } from "../helper/Const";
import authHeader from "./auth-header";

const API_URL = DOMAIN + "api/chat/";

class MessageService {
  getMessages(roomId, userId, offset) {
    return axios.get(
      API_URL +
        "getMessages?roomId=" +
        roomId +
        "&userId=" +
        userId +
        "&offset=" +
        offset,
      {
        headers: authHeader(),
      }
    );
  }
}

export default new MessageService();
