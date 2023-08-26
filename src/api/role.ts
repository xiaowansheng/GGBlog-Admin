import { http } from "@/utils/http";
import Result, { PageData } from "./constant/result";

export interface RoleDto {
  id: number;
  name: string;
  label: string;
  description: string;
  disable: number;
  createTime: string;
  updateTime: string;
}

export interface Role {
  id: number | null;
  name: string;
  label: string;
  description: string;
  disable: number;
}

/**
 * 获取所有的角色信息
 * @param params
 * @param config
 * @returns
 */
export const getAllRoles = (params?: any, config?: any) => {
  return http.get<any, Result<RoleDto[]>>("/role/list", params, config);
  // return http.request<Result<PageData<RoleDto>>>("get", "/role/list");
};

/**
 * 添加角色信息
 * @param params
 * @param config
 * @returns
 */
export const addRole = (params?: any, config?: any) => {
  return http.post<any, Result<PageData<RoleDto>>>("/role", params, config);
  // return http.request<Result<PageData<RoleDto>>>("get", "/role/list");
};

/**
 * 获取所有指定角色的菜单信息
 * @param params
 * @param config
 * @returns
 */
export const getRoleMenu = (params?: any, config?: any) => {
  return http.get<any, Result<PageData<any>>>("/role/menu", params, config);
};

/**
 * 获取所有指定角色的资源信息
 * @param params
 * @param config
 * @returns
 */
export const getRoleResource = (params?: any, config?: any) => {
  return http.get<any, Result<PageData<any>>>("/role/resource", params, config);
};
