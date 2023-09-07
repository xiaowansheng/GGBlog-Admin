import { http } from "@/utils/http";
import Result, { PageData } from "./constant/result";

export interface NameLabelDto {
  name: string;
  label: string;
}


/**
 * 获取内容访问权限类型
 * @param params
 * @param config
 * @returns
 */
export const getContentStatus = (params?: any, config?: any) => {
  return http.get<any, Result<PageData<NameLabelDto[]>>>(
    "/common/content/status",
    params,
    config
  );
};


/**
 * 获取所有用户类型
 * @param params
 * @param config
 * @returns
 */
export const getUserType = (params?: any, config?: any) => {
  return http.get<any, Result<any>>("/common/user/type", params, config);
};
