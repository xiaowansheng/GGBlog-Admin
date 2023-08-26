import { http } from "@/utils/http";
import Result, { PageData } from "./constant/result";

export interface MenuDto {
  id: number;
  name: string;
  label: string;
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
  label: string;
  icon: string;
  redirect: string;
  path: string;
  component: string;
  parentId: number|null;
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
  return http.get<any, Result<MenuDto[]>>("/menu/list", params, config);
  // return http.request<Result<PageData<RoleDto>>>("get", "/role/list");
};
