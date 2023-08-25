export interface RoleDto {
  id: number;
  name: string;
  label: string;
  description: string;
  disable: number;
  createTime: string;
  updateTime: string;
}

export class Role {
  id: number | null;
  name: string;
  label: string;
  description: string;
  disable: number;
}
