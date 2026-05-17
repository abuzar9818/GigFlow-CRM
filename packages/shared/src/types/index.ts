export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SALES_USER';
  createdAt?: Date;
  updatedAt?: Date;
}
