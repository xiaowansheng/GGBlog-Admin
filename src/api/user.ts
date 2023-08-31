import { http } from "@/utils/http";
import Result from "./constant/result";
import { PageData } from "./constant/result";
export type LoginData = {
  /** 用户名 */
  username: string;
  /** 当前登陆用户的角色 */
  roles: Array<string>;
  /** `token` */
  accessToken: string;
  /** 用于调用刷新`accessToken`的接口时所需的`token` */
  refreshToken: string;
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  expires: Date;
};

export type RefreshTokenResult = {
  /** `token` */
  accessToken: string;
  /** 用于调用刷新`accessToken`的接口时所需的`token` */
  refreshToken: string;
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  expires: Date;
};

export type UserAuthDto = {
  id: number;
  userInfoId: number;
  username: string;
  password: string;
  loginType: string;
  thirdPartyId: string;
  thirdPartyProfile: string;
  disable: number;
  ipAddressSignup: string;
  ipSourceSignup: string;
  createTime: string;
  updateTime: string;
  userInfoDto: UserInfoDto;
  roleNames: string[];
};

export type UserInfoDto = {
  id: number;
  email: string;
  qq: string;
  nickname: string;
  avatar: string;
  signature: string;
  website: string;
  introduction: string;
  createTime: string;
  updateTime: string;
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<LoginData>("post", "/user/auth/login", null, { data });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/user/auth/refreshToken", {
    data
  });
};

/**
 * 分页获取用户列表
 * @param data
 * @returns
 */
export const getUserPage = (params?: any) => {
  return http.get<any, Result<PageData<UserAuthDto>>>(
    "/user/auth/page",
    params
  );
};

/**
 * 获取所有登录类型
 * @param data
 * @returns
 */
export const geAlltLoginType = () => {
  return http.get<any, Result<any>>("/user/auth/login/type");
};

/**
 * 修改用户信息
 * @param data
 * @returns
 */
export const updateUser = (data?: object) => {
  return http.request<Result<any>>("put", "/user/auth", null, { data });
};

/**
 * 修改用户信息
 * @param data
 * @returns
 */
export const addUser = (data?: object) => {
  return http.request<Result<any>>("post", "/user/auth", null, { data });
};

/**
 * 修改用户信息
 * @param data
 * @returns
 */
export const updateUserStatus = (data?: object) => {
  return http.request<Result<any>>("put", "/user/auth/status", null, { data });
};
