import { http } from "@/utils/http";
import Result, { PageData } from "./constant/result";

export interface OperationDto {
  id: number;
  userAuthId: number;
  userName: string;
  version: string;
  requestUrl: string;
  module: string;
  callingMethod: string;
  type: string;
  description: string;
  requestMethod: string;
  requestParam: string;
  responseData: string;
  elapsedTime: number;
  ipAddress: string;
  ipSource: string;
  device: string;
  browser: string;
  createTime: string;
  updateTime: string;
}


/**
 * 分页获取操作日志信息
 * @param params
 * @param config
 * @returns
 */
export const getOperationPage = (params?: any, config?: any) => {
  return http.get<any, Result<PageData<[]>>>("/log/operation/page", params, config);
  // return http.request<Result<PageData<RoleDto>>>("get", "/role/list");
};
