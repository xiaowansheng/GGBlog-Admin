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
  id: number | null;
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

/**
 * 获取作者信息
 * @param params
 * @param config
 * @returns
 */
export const getAuthorConfig = (params?: any, config?: any) => {
  return http.get<any, Result<ConfigDto>>(
    "/website/config/author/info",
    params,
    config
  );
};

/**
 * 获取作者社交方式
 * @param params
 * @param config
 * @returns
 */
export const getContactConfig = (params?: any, config?: any) => {
  return http.get<any, Result<ConfigDto>>(
    "/website/config/author/contact",
    params,
    config
  );
};

/**
 * 获取登录配置
 * @param params
 * @param config
 * @returns
 */
export const getLoginConfig = (params?: any, config?: any) => {
  return http.get<any, Result<ConfigDto>>(
    "/website/config/login/thirdparty",
    params,
    config
  );
};

/**
 * 获取额外组件配置
 * @param params
 * @param config
 * @returns
 */
export const getModuleConfig = (params?: any, config?: any) => {
  return http.get<any, Result<ConfigDto>>(
    "/website/config/component",
    params,
    config
  );
};

/**
 * 获取隐私和安全配置
 * @param params
 * @param config
 * @returns
 */
export const getPrivacyConfig = (params?: any, config?: any) => {
  return http.get<any, Result<ConfigDto>>(
    "/website/config/privacy",
    params,
    config
  );
};

/**
 * 获取系统通知配置
 * @param params
 * @param config
 * @returns
 */
export const getNoticeConfig = (params?: any, config?: any) => {
  return http.get<any, Result<ConfigDto>>(
    "/website/config/notice",
    params,
    config
  );
};

/**
 * 获取默认头像图片等配置
 * @param params
 * @param config
 * @returns
 */
export const getAvatarConfig = (params?: any, config?: any) => {
  return http.get<any, Result<ConfigDto>>(
    "/website/config/avatar",
    params,
    config
  );
};

/**
 * 获取打赏配置
 * @param params
 * @param config
 * @returns
 */
export const getRewardConfig = (params?: any, config?: any) => {
  return http.get<any, Result<ConfigDto>>(
    "/website/config/reward",
    params,
    config
  );
};


/**
 * 获取关于作者信息
 * @param params
 * @param config
 * @returns
 */
export const getAboutAuthor = (params?: any, config?: any) => {
  return http.get<any, Result<ConfigDto>>(
    "/website/config/about",
    params,
    config
  );
};