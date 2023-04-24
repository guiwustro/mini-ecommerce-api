export const changeFileName = (originalname: string) => {
  const name = originalname.split('.')[0];
  const fileExtension = originalname.split('.')[1];
  const newFileName =
    name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
  return newFileName;
};
