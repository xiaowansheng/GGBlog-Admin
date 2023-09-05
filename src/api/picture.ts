import { http } from "@/utils/http";
import Result, { PageData } from "./constant/result";

export interface PictureDto {
  id: number;
  userAuthId: number;
  albumId: number;
  name: string;
  description: string;
  url: string;
  source: string;
  status: string;
  createTime: string;
  updateTime: string;
}

export interface Picture {
  id: number | null;
  albumId: number|null;
  name: string;
  description: string;
  url: string|null;
  source: string;
  status: string;
}

/**
 * 分页获取照片列表
 * @param params
 * @param config
 * @returns
 */
export const getPicturePage = (params?: any, config?: any) => {
  return http.get<any, Result<PageData<PictureDto>>>(
    "/picture/page",
    params,
    config
  );
};

/**
 * 添加照片信息
 * @param params
 * @param config
 * @returns
 */
export const addPicture = (params?: any, config?: any) => {
  return http.post<any, Result<any>>("/picture", params, config);
};

/**
 * 批量添加照片信息
 * @param params
 * @param config
 * @returns
 */
export const addBatchPicture = (params?: any, config?: any) => {
  return http.post<any, Result<any>>("/picture/batch", params, config);
};
/**
 * 修改照片信息
 * @param params
 * @param config
 * @returns
 */
export const updatePicture = (params?: any, config?: any) => {
  return http.put<any, Result<any>>("/picture", params, config);
};

/**
 * 删除指定的照片信息
 * @param params
 * @param config
 * @returns
 */
export const deletePicture = (
  pathVariable: number,
  params?: any,
  config?: any
) => {
  return http.delete<any, Result<any>>(
    "/picture/" + pathVariable,
    params,
    config
  );
};
