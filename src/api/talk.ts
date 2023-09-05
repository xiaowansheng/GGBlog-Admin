import { http } from "@/utils/http";
import Result, { PageData } from "./constant/result";

export interface TalkDto {
  id: number;
  userAuthId: number;
  content: string;
  images: string[];
  status: string;
  top: number;
  ipAddress: string;
  ipSource: string;
  device: string;
  browser: string;
  point: string[];
  location: string;
  createTime: string;
  updateTime: string;
  pageView: number;
  commentCount: number;
}

export interface Talk {
  id: number | null;
  content: string;
  images: string[];
  status: string;
  top: number;
  // point: number[];
  // location: string;
}

/**
 * 分页获取说说列表
 * @param params
 * @param config
 * @returns
 */
export const getTalkPage = (params?: any, config?: any) => {
  return http.get<any, Result<TalkDto[]>>("/talk/page", params, config);
};

/**
 * 添加说说信息
 * @param params
 * @param config
 * @returns
 */
export const addTalk = (params?: any, config?: any) => {
  return http.post<any, Result<any>>("/talk", params, config);
};

/**
 * 修改说说信息
 * @param params
 * @param config
 * @returns
 */
export const updateTalk = (params?: any, config?: any) => {
  return http.put<any, Result<any>>("/talk", params, config);
};

// /**
//  * 修改相册信息
//  * @param params
//  * @param config
//  * @returns
//  */
// export const updateTalkStatus = (params?: any, config?: any) => {
//   return http.put<any, Result<any>>("/talk/status", params, config);
// };

/**
 * 删除指定的说说信息
 * @param params
 * @param config
 * @returns
 */
export const deletTalk = (pathVariable: number, params?: any, config?: any) => {
  return http.delete<any, Result<any>>("/talk/" + pathVariable, params, config);
};

/**
 * 根据id查找指定的说说信息
 * @param params
 * @param config
 * @returns
 */
export const getTalkById = (pathVariable: number, params?: any, config?: any) => {
  return http.get<any, Result<any>>("/talk/" + pathVariable, params, config);
};
