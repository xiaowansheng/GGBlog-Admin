import { http } from "@/utils/http";
import Result from "./constant/result";
import { PageData } from "./constant/result";

export interface ArticleDto  {
  id: number;
  userAuthId: number;
  categoryId: number;
  title: string;
  cover: string;
  content: string;
  type: string;
  originalAuthor: string;
  originalTitle: string;
  originalUrl: string;
  note: string;
  top: number;
  status: string;
  createTime: string;
  updateTime: string;
  categoryDto: {
    id: number;
    name: string;
  };
  tagDtos: [
    {
      id: number;
      name: string;
    }
  ];
  pageView: number;
  commentCount: number;
};

export interface Article {
  id: number | null;
  title: string;
  cover: string;
  content: string;
  type: string;
  originalAuthor: string;
  originalTitle: string;
  originalUrl: string;
  note: string;
  top: number;
  status: string;
  categoryVo: {
    id: number;
    name: string;
  };
  tagVos: 
    {
      id: number;
      name: string;
    }[]
  
}
/**
 * 分页获取文章列表
 * @param data
 * @returns
 */
export const getArticlePage = (params?: any) => {
  return http.get<any, Result<PageData<ArticleDto>>>("/article/page", params);
};

/**
 * 根据id获取文章信息
 * @param data
 * @returns
 */
export const getArticleById = (pathVariable:string) => {
  return http.get<any, Result<ArticleDto>>("/article/"+pathVariable,);
};

/**
 * 获取所有文章类型
 * @param data
 * @returns
 */
export const getAllArticleType = () => {
  return http.get<any, Result<any>>("/article/type");
};

/**
 * 修改文章信息
 * @param data
 * @returns
 */
export const updateArticle = (data?: object) => {
  return http.request<Result<any>>("put", "/article", null, { data });
};

/**
 * 添加文章信息
 * @param data
 * @returns
 */
export const addArticle = (data?: object) => {
  return http.request<Result<any>>("post", "/aricle", null, { data });
};

/**
 * 保存文章草稿
 * @param data
 * @returns
 */
export const addArticleDraft = (data?: object) => {
  return http.request<Result<any>>("post", "/aricle/draft", null, { data });
};

/**
 * 简单修改文章信息
 * @param data
 * @returns
 */
export const updateSimpleArticle = (data?: object) => {
  return http.request<Result<any>>("put", "/article/simple", null, { data });
};

/**
 * 更新文章置顶状态
 * @param data
 * @returns
 */
export const updateArticleTop = (data?: object) => {
  return http.request<Result<any>>("put", "/article/top", null, { data });
};

/**
 * 删除文章信息
 * @param data
 * @returns
 */
export const deleteArticle = (pathVariable:number) => {
  return http.request<Result<any>>("delete", "/article/" + pathVariable);
};
