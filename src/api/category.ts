import { http } from "@/utils/http";
import Result from "./constant/result";
import { PageData } from "./constant/result";

export interface CategoryDto {
  id: number;
  name: string;
  description: string;
  hidden: number;
  createTime: string;
  updateTime: string;
  count: number;
};

export interface Category {
  id: number;
  name: string;
  description: string;
  hidden: number;
}
/**
 * 分页获取分类列表
 * @param data
 * @returns
 */
export const getCategoryPage = (params?: any) => {
  return http.get<any, Result<PageData<CategoryDto>>>("/category/detail/page", params);
};


/**
 * 修改分类信息
 * @param data
 * @returns
 */
export const updateCategory = (data?: object) => {
  return http.request<Result<any>>("put", "/category", null, { data });
};

/**
 * 添加分类信息
 * @param data
 * @returns
 */
export const addCategory = (data?: object) => {
  return http.request<Result<any>>("post", "/category", null, { data });
};


/**
 * 删除分类信息
 * @param data
 * @returns
 */
export const deleteCategory = (pathVariable:number) => {
  return http.request<Result<any>>("delete", "/category/" + pathVariable);
};


/**
 * 修改分类状态信息
 * @param data
 * @returns
 */
export const updateCategoryStatus = (data?: object) => {
  return http.request<Result<any>>("put", "/category/status", null, { data });
};

/**
 * 获取所有分类的简单信息
 * @param data
 * @returns
 */
export const getAllCategory = (params?: any) => {
  return http.get<any, Result<categoryDto[]>>("/category/simple/list", params);
};

