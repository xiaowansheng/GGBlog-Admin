import { http } from "@/utils/http";
import Result, { PageData } from "./constant/result";

export interface GuestbookDto {
  id: number;
  userAuthId: number;
  topicType: string;
  topicId: number;
  content: string;
  images: string;
  ipAddress: string;
  ipSource: string;
  device: string;
  browser: string;
  point: string;
  location: string;
  type: string;
  nickname: string;
  email: string;
  qq: string;
  hidden: number;
  review: number;
  createTime: string;
  updateTime: string;
}

export interface Guestbook {
  id: number;
  hidden: number;
  review: number;
}

/**
 * 分页获取留言信息
 * @param params
 * @param config
 * @returns
 */
export const getLeaveWordPage = (params: any, config?: any) => {
  return http.get<any, Result<PageData<GuestbookDto[]>>>(
    "/guestbook/page",
    params,
    config
  );
};

/**
 * 修改留言状态信息
 * @param params
 * @param config
 * @returns
 */
export const updateLeaveWord = (data) => {
  return http.put<any, Result<any>>("/guestbook", null, {data});
};

// /**
//  * 修改评论状态
//  * @param params
//  * @param config
//  * @returns
//  */
// export const updateCommentStatus = (params?: any, config?: any) => {
//   return http.put<any, Result<any>>("/comment/status", params, config);
// };

/**
 * 删除指定的留言信息
 * @param params
 * @param config
 * @returns
 */
export const deleteLeaveWord = (
  pathVariable: number,
  params?: any,
  config?: any
) => {
  return http.delete<any, Result<any>>(
    "/guestbook/" + pathVariable,
    params,
    config
  );
};


/**
 * 批量删除评论
 * @param params
 * @param config
 * @returns
 */
export const deleteBatchLeaveWord = (data:number[]|string[]
) => {
  return http.delete<any, Result<any>>("/guestbook/batch", null, { data });
};