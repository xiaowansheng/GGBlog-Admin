import { http } from "@/utils/http";
import Result from "./constant/result";

/**
 * 获取阿里云oss授权上传凭证
 * @param params
 * @param config
 * @returns
 */
export const getOss = (dir:string,params?: any, config?: any) => {
  return http.get<any, Result<any>>(
    "/upload/oss/access/info/"+dir,
    params,
    config
  );
};

