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

export const getAllRoles = (params?: any, config?: any) => {
  return http.get<any, Result<PageData<RoleDto>>>("/role/list", params, config);
  // return http.request<Result<PageData<RoleDto>>>("get", "/role/list");
};
