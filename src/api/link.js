/**
 * @author qyy
 * @description api
 */
import ajax from "./ajax";

//getRank
export const reqGetRank = () =>
  ajax("/getRank", {}, "GET");

//addRank
export const reqAddRank = (name, score) =>
  ajax("/addRank", {
    name,
    score
  }, "POST");