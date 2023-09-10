import { http } from "@/utils/http";
import Result,{NameValueDto} from "./constant/result";

export interface StatisticsOfNumberDto {
  article: number;
  category: number;
  tag: number;
  talk: number;
}

/**
 * 获取各个数据的数量统计
 * @returns
 */
export const getStatisticOfNumber = () => {
  return http.get<any, Result<StatisticsOfNumberDto>>(
    "/article/statistics/number"
  );
};

/**
 * 根据日期间隔获取文章数量统计
 * @returns
 */
export const getStatisticOfArticleCount = (params: any) => {
  return http.get<any, Result<NameValueDto[]>>(
    "/article/statistics/count",
    params
  );
};

/**
 * 根据日期间隔获取说说数量统计
 * @returns
 */
export const getStatisticOfTalkCount = (params: any) => {
  return http.get<any, Result<NameValueDto[]>>(
    "/talk/statistics/count",
    params
  );
};

/**
 * 获取所有分类对应文章数量统计
 * @returns
 */
export const getStatisticOfCategory = () => {
  return http.get<any, Result<NameValueDto[]>>(
    "/category/statistics"
  );
};

