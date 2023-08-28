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
};

/**
 * 添加角色信息
 * @param params
 * @param config
 * @returns
 */
export const addRole = (params?: any, config?: any) => {
  return http.post<any, Result<any>>("/role", params, config);
};

/**
 * 修改角色信息
 * @param params
 * @param config
 * @returns
 */
export const updateRole = (params?: any, config?: any) => {
  return http.put<any, Result<any>>("/role", params, config);
};

/**
 * 修改角色信息
 * @param params
 * @param config
 * @returns
 */
export const updateRoleStatus = (params?: any, config?: any) => {
  return http.put<any, Result<any>>("/role/status", params, config);
};


/**
 * 删除指定的角色信息
 * @param params
 * @param config
 * @returns
 */
export const deleteRole = (
  pathVariable: number,
  params?: any,
  config?: any
) => {
  return http.delete<any, Result<any>>("/role/" + pathVariable, params, config);
};


/**
 * 获取指定角色的所有菜单信息
 * @param params
 * @param config
 * @returns
 */
export const getRoleMenu = (pathVariable:number,params?: any, config?: any) => {
  return http.get<any, Result<any>>("/role/menu/list/"+pathVariable, params, config);
};


/**
 * 给指定角色添加菜单权限
 * @param params
 * @param config
 * @returns
 */
export const updateRoleMenus = (params?: any, config?: any) => {
  return http.put<any, Result<any>>("/role/menu/batch", params, config);
};

/**
 * 获取所有指定角色的资源信息
 * @param params
 * @param config
 * @returns
 */
export const getRoleResource = (pathVariable: number, params?: any, config?: any) => {
  return http.get<any, Result<any>>("/role/resource/list/"+pathVariable, params, config);
};



/**
 * 给指定角色添加资源权限
 * @param params
 * @param config
 * @returns
 */
export const updateRoleResources = (params?: any, config?: any) => {
  return http.put<any, Result<PageData<any>>>("/role/resource/batch", params, config);
};
