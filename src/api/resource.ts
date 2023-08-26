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
 * 分页获取资源信息
 * @param params
 * @param config
 * @returns
 */
export const getResourcePage = (params?: any, config?: any) => {
  return http.get<any, Result<PageData<ResourceDto>>>(
    "/resource/page",
    params,
    config
  );
  // return http.request<Result<PageData<RoleDto>>>("get", "/role/list");
};
