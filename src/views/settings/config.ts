export interface ConfigJson<T> {
  id: number;
  name: string;
  label: string;
  value: T;
  description: string;
  createTime: string;
  updateTime: string;
}
