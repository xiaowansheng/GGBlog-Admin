import { http } from "@/utils/http";
import Result, { PageData } from "./constant/result";

export interface CommentDto {
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
  rootId: number;
  parentId: number;
  type: string;
  nickname: string;
  email: string;
  qq: string;
  hidden: number;
  review: number;
  createTime: string;
  updateTime: string;
}

export interface Comment {
  id: number;
  hidden: number;
  review: number;
}

/**
 * 分页获取评论信息
 * @param params
 * @param config
 * @returns
 */
export const getCommentPage = (params?: any, config?: any) => {
  return http.get<any, Result<PageData<CommentDto[]>>>(
    "/comment/page",
    params,
    config
  );
};

/**
 * 修改评论状态信息
 * @param params
 * @param config
 * @returns
 */
export const updateComment = (params?: any, config?: any) => {
  return http.put<any, Result<any>>("/comment", params, config);
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
 * 删除指定的评论信息
 * @param params
 * @param config
 * @returns
 */
export const deleteComment = (
  pathVariable: number,
  params?: any,
  config?: any
) => {
  return http.delete<any, Result<any>>(
    "/comment/" + pathVariable,
    params,
    config
  );
};

/**
 * 获取所有话题类型
 * @param params
 * @param config
 * @returns
 */
export const getAllTopicType = (params?: any, config?: any) => {
  return http.get<any, Result<any>>("/comment/topic/type", params, config);
};




/**
 * 批量删除评论
 * @param params
 * @param config
 * @returns
 */
export const deleteBatchComment = (data:number[]|string[]
) => {
  return http.delete<any, Result<any>>(
    "/comment/batch",
    null,
    {data}
  );
};