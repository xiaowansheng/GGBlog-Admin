import { http } from "@/utils/http";
import Result, { PageData } from "./constant/result";

export interface FriendDto {
  id: number;
  userAuthId: number;
  name: string;
  icon: string;
  url: string;
  author: string;
  introduction: string;
  review: number;
  hidden: number;
  createTime: string;
  updateTime: string;
}

export interface Friend {
  id: number;
  name: string;
  icon: string;
  url: string;
  author: string;
  introduction: string;
  review: number;
  hidden: number;
}

/**
 * 分页获取友链信息
 * @param params
 * @param config
 * @returns
 */
export const getFriendPage = (params?: any, config?: any) => {
  return http.get<any, Result<PageData<FriendDto[]>>>(
    "/friend/page",
    params,
    config
  );
};

/**
 * 添加友链信息
 * @param params
 * @param config
 * @returns
 */
export const addFriend = (params?: any, config?: any) => {
  return http.post<any, Result<any>>("/friend", params, config);
};

/**
 * 修改友链信息
 * @param params
 * @param config
 * @returns
 */
export const updateFriend = (params?: any, config?: any) => {
  return http.put<any, Result<any>>("/friend", params, config);
};

/**
 * 修改友链状态
 * @param params
 * @param config
 * @returns
 */
export const updateFriendStatus = (params?: any, config?: any) => {
  return http.put<any, Result<any>>("/friend/status", params, config);
};

/**
 * 删除指定的友链信息
 * @param params
 * @param config
 * @returns
 */
export const deleteFriend = (
  pathVariable: number,
  params?: any,
  config?: any
) => {
  return http.delete<any, Result<any>>(
    "/friend/" + pathVariable,
    params,
    config
  );
};
