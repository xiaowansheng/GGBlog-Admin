export default interface Result<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageData<T>{
  total: number;
  list:T[]
}