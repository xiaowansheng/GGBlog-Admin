import { http } from "@/utils/http";
import Result from "./constant/result";

export interface ConfigDto {
  id: number;
  name: string;
  label: string;
  value: string;
  description: string;
  createTime: string;
  updateTime: string;
}

export interface Config {
  id: number |null;
  name: string;
  label: string;
  value: string;
  description: string;
}


/**
 * 修改配置信息
 * @param params
 * @param config
 * @returns
 */
export const updateConfig = (params?: any, config?: any) => {
  return http.put<any, Result<ConfigDto>>("/website", params, config);
  // return http.request<Result<PageData<RoleDto>>>("get", "/role/list");
};

/**
 * 获取主页菜单信息
 * @param params
 * @param config
 * @returns
 */
export const getMenuConfig = (params?: any, config?: any) => {
  return http.get<any, Result<ConfigDto>>(
    "/website/config/covers",
    params,
    config
  );
};

/**
 * 获取网站信息
 * @param params
 * @param config
 * @returns
 */
export const getWebsiteConfig = (params?: any, config?: any) => {
  return http.get<any, Result<ConfigDto>>(
    "/website/config/information",
    params,
    config
  );
};
