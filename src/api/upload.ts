import { http } from "@/utils/http";
import Result from "./constant/result";

export type FileDto = {
  name: string;
  path: string;
  link: string;
  type: string;
};
/**
 * 获取阿里云oss授权上传凭证
 * @param params
 * @param config
 * @returns
 */
export const getOss = (dir: string, params?: any, config?: any) => {
  return http.get<any, Result<any>>(
    "/upload/oss/access/info/" + dir,
    params,
    config
  );
};

/**
 * 获取阿里云oss授权上传凭证
 * @param params
 * @param config
 * @returns
 */
export const uploadFile = (params?: any, config?: any) => {
  return http.post<any, Result<any>>("/file/upload", params, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    ...config,

  });
};
