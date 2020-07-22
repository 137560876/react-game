/**
 * @author qyy
 * @description api
 */
import ajax from "./ajax";

//getRank
export const reqGetRank = () =>
  ajax("http://47.97.202.111:8085/getRank", {}, "GET");

//addRank
export const reqAddRank = (name, score) =>
  ajax("http://47.97.202.111:8085/addRank", {
    name,
    score
  }, "POST");