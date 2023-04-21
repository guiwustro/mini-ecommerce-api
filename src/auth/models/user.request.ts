import { UserDocument } from '../../users/schemas/user.schema';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: UserDocument;
}
