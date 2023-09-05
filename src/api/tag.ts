import { http } from "@/utils/http";
import Result from "./constant/result";
import { PageData } from "./constant/result";

export interface TagDto {
  id: number;
  name: string;
  description: string;
  hidden: number;
  createTime: string;
  updateTime: string;
  count: number;
};

export interface Tag {
  id: number;
  name: string;
  description: string;
  hidden: number;
}
/**
 * 分页获取标签列表
 * @param data
 * @returns
 */
export const getTagPage = (params?: any) => {
  return http.get<any, Result<PageData<TagDto>>>("/tag/page", params);
};


/**
 * 修改标签信息
 * @param data
 * @returns
 */
export const updateTag = (data?: object) => {
  return http.request<Result<any>>("put", "/tag", null, { data });
};

/**
 * 添加标签信息
 * @param data
 * @returns
 */
export const addTag = (data?: object) => {
  return http.request<Result<any>>("post", "/tag", null, { data });
};


/**
 * 删除标签信息
 * @param data
 * @returns
 */
export const deleteTag = (pathVariable:number) => {
  return http.request<Result<any>>("delete", "/tag/" + pathVariable);
};



/**
 * 修改标签状态信息
 * @param data
 * @returns
 */
export const updateTagStatus = (data?: object) => {
  return http.request<Result<any>>("put", "/tag/status", null, { data });
};

/**
 * 获取所有标签的简单信息
 * @param data
 * @returns
 */
export const getAllTag = (params?: any) => {
  return http.get<any, Result<TagDto[]>>("/tag/simple/list", params);
};
