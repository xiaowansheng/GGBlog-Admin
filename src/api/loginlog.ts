import { http } from "@/utils/http";
import Result from "./constant/result";
import { PageData } from "./constant/result";

export type LoginLogDto = {
  id: number;
  userAuthId: number;
  ipAddress: string;
  ipSource: string;
  device: string;
  browser: string;
  point: string[];
  location: string;
  createTime: string;
  updateTime: string;
};


/**
 * 分页获取用户登录日志
 * @param data
 * @returns
 */
export const getLoginLogPage = (params?: any) => {
  return http.get<any, Result<PageData<LoginLogDto>>>(
    "/log/login/page",
    params
  );
};
