import { diskStorage } from 'multer';
import { changeFileName } from './change-file-name';

export const uploadConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const newFileName = changeFileName(file.originalname);
      cb(null, newFileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(null, false);
    }
    cb(null, true);
  },
};
