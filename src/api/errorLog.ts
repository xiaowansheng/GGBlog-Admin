import { http } from "@/utils/http";
import Result, { PageData } from "./constant/result";

export interface ErrorDto {
  id: number;
  userAuthId: number;
  userName: string;
  version: string;
  requestUrl: string;
  requestMethod: string;
  requestParam: string;
  module: string;
  callingMethod: string;
  errorName: string;
  errorMessage: string;
  ipAddress: string;
  ipSource:string;
  device: string;
  browser: string;
  createTime: string;
  updateTime: string;
}

/**
 * 分页获取异常日志信息
 * @param params
 * @param config
 * @returns
 */
export const getErrorPage = (params?: any, config?: any) => {
  return http.get<any, Result<PageData<ErrorDto[]>>>(
    "/log/error/page",
    params,
    config
  );
  // return http.request<Result<PageData<RoleDto>>>("get", "/role/list");
};
