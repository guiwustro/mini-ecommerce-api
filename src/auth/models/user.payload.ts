export interface IUserPayload {
  sub: string;
  username: string;
  type: 'common' | 'admin';
  iat?: number;
  exp?: number;
}
