// export const baseUrlApi = (url: string) =>
//   process.env.NODE_ENV === "development"
//     ? `/api/${url}`
//     : `http://127.0.0.1:8081/${url}`;

export const baseUrlApi = (url: string) =>
  process.env.NODE_ENV === "development"
    ? `http://127.0.0.1:8081/${url}`
    : `/api/${url}`;

export const baseURL =
  process.env.NODE_ENV === "development" ? `http://192.168.2.120:8081` : `/api`;