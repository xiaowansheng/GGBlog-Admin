import { http } from "@/utils/http";
import Result, { PageData } from "./constant/result";

export interface MenuDto {
  id: number;
  name: string;
  title: string;
  icon: string;
  redirect: string;
  path: string;
  component: string;
  parentId: number;
  hidden: number;
  sort: number;
  description: string;
  createTime: string;
  updateTime: string;
  children: MenuDto[];
}

export interface Menu {
  id: number | null;
  name: string;
  title: string;
  icon: string;
  redirect: string;
  path: string;
  component: string;
  parentId: number | null;
  hidden: number;
  sort: number;
  description: string;
}

/**
 * 获取所有的菜单信息
 * @param params
 * @param config
 * @returns
 */
export const getAllMenus = (params?: any, config?: any) => {
  return http.get<any, Result<MenuDto[]>>("/system/menu/tree", params, config);
  // return http.request<Result<PageData<RoleDto>>>("get", "/role/list");
};


/**
 * 添加菜单信息
 * @param params
 * @param config
 * @returns
 */
export const addMenu = (params?: any, config?: any) => {
  return http.post<any, Result<MenuDto[]>>("/system/menu", params, config);
  // return http.request<Result<PageData<RoleDto>>>("get", "/role/list");
};


/**
 * 修改菜单信息
 * @param params
 * @param config
 * @returns
 */
export const updateMenu = (params?: any, config?: any) => {
  return http.put<any, Result<MenuDto[]>>("/system/menu", params, config);
  // return http.request<Result<PageData<RoleDto>>>("get", "/role/list");
};

/**
 * 删除菜单信息
 * @param params
 * @param config
 * @returns
 */
export const deleteMenu = (pathVariable:number|string) => {
  return http.delete<any, Result<MenuDto[]>>("/system/menu/"+pathVariable);
};

/**
 * 修改菜单信息
 * @param params
 * @param config
 * @returns
 */
export const updateMenuStatus = (params?: any, config?: any) => {
  return http.put<any, Result<MenuDto[]>>("/system/menu/status", params, config);
};

/**
 * 获取菜单树结构
 * @param params
 * @param config
 * @returns
 */
export const getSimpleTree = (params?: any, config?: any) => {
  return http.get<any, Result<MenuDto[]>>("/system/menu/simple/tree", params, config);
  // return http.request<Result<PageData<RoleDto>>>("get", "/role/list");
};

