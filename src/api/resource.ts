import { http } from "@/utils/http";
import Result, { PageData } from "./constant/result";

export interface ResourceDto {
  id: number;
  name: string;
  requestMethod: string;
  path: string;
  open: number;
  parentId: number;
  description: string;
  createTime: string;
  updateTime: string;
  children: ResourceDto[];
}

export interface Resource {
  id: number | null;
  name: string;
  requestMethod: string;
  path: string;
  open: number;
  parentId: number | null;
  description: string;
}

/**
 * 获取资源树结构
 * @param params
 * @param config
 * @returns
 */
export const getTree = (params?: any, config?: any) => {
  return http.get<any, Result<ResourceDto[]>>(
    "/system/resource/tree",
    params,
    config
  );
};

/**
 * 添加资源信息
 * @param params
 * @param config
 * @returns
 */
export const addResource = (params?: any, config?: any) => {
  return http.post<any, Result<any>>(
    "/system/resource",
    params,
    config
  );
};


/**
 * 修改资源信息
 * @param params
 * @param config
 * @returns
 */
export const updateResource = (params?: any, config?: any) => {
  return http.put<any, Result<any>>(
    "/system/resource",
    params,
    config
  );
};

/**
 * 删除资源信息
 * @param params
 * @param config
 * @returns
 */
export const deleteResource = (params?: any, config?: any) => {
  return http.post<any, Result<any>>(
    "/system/resource",
    params,
    config
  );
};


/**
 * 修改资源开放状态
 * @param params
 * @param config
 * @returns
 */
export const updateResourceStatus = (params?: any, config?: any) => {
  return http.put<any, Result<any>>(
    "/system/resource/status",
    params,
    config
  );
};

/**
 * 获取资源树结构
 * @param params
 * @param config
 * @returns
 */
export const getSimpleTree = (params?: any, config?: any) => {
  return http.get<any, Result<ResourceDto[]>>(
    "/system/resource/simple/tree",
    params,
    config
  );
};
