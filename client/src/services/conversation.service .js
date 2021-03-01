import axios from "axios";
import { DOMAIN } from "../helper/Const";
import authHeader from "./auth-header";

const API_URL = DOMAIN + "api/conversation/";

class ConversationService {
  getConversation(userId) {
    return axios.get(API_URL + "getList?userId=" + userId, {
      headers: authHeader(),
    });
  }

  addConversation(userId) {
    return axios.get(API_URL + "addConversation?userId=" + userId, {
      headers: authHeader(),
    });
  }

  // addBlock(userId, blockId, blockName) {
  //   return axios.get(
  //     API_URL_BLOCK +
  //       "addBlock?userId=" +
  //       userId +
  //       "&blockId=" +
  //       blockId +
  //       "&blockName=" +
  //       blockName,
  //     {
  //       header: authHeader(),
  //     }
  //   );
  // }

  // getBlock(userId) {
  //   return axios.get(API_URL_BLOCK + "getBlock?userId=" + userId, {
  //     headers: authHeader(),
  //   });
  // }
}

export default new ConversationService();
