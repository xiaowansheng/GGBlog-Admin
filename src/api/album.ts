import { http } from "@/utils/http";
import Result, { PageData } from "./constant/result";

export interface AlbumDto {
  id: number;
  userAuthId: number;
  name: string;
  description: string;
  cover: string;
  status: string;
  createTime:string;
  updateTime: string;
  pageView: number;
  commentCount: number;
}

export interface Album {
  id: number | null;
  name: string;
  description: string;
  cover: string;
  status: string;
}

/**
 * 分页获取相册列表
 * @param params
 * @param config
 * @returns
 */
export const getAlbumPage = (params?: any, config?: any) => {
  return http.get<any, Result<AlbumDto[]>>("/album/page", params, config);
};

/**
 * 添加相册信息
 * @param params
 * @param config
 * @returns
 */
export const addAlbum = (params?: any, config?: any) => {
  return http.post<any, Result<any>>("/album", params, config);
};

/**
 * 修改相册信息
 * @param params
 * @param config
 * @returns
 */
export const updateAlbum = (params?: any, config?: any) => {
  return http.put<any, Result<any>>("/album", params, config);
};

// /**
//  * 修改相册信息
//  * @param params
//  * @param config
//  * @returns
//  */
// export const updateRoleStatus = (params?: any, config?: any) => {
//   return http.put<any, Result<any>>("/role/status", params, config);
// };


/**
 * 删除指定的角色信息
 * @param params
 * @param config
 * @returns
 */
export const deleteAlbum = (
  pathVariable: number,
  params?: any,
  config?: any
) => {
  return http.delete<any, Result<any>>("/album/" + pathVariable, params, config);
};
