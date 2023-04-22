export interface IUserFromJwt {
  _id: string;
  type: 'common' | 'admin';
  username: string;
}
