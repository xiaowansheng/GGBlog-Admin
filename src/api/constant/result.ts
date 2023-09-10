export default interface Result<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageData<T>{
  total: number;
  list:T[]
}

export interface IdNameDto{
  id: number;
  name: string;
}


export interface NameValueDto {
  name: string;
  value: string;
}