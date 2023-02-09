interface IValidate {
  [key: string]: (str: string) => boolean
}
const validate: IValidate = {
  email: (str: string): boolean => {
    const pattern = /^(\S+)@([a-z0-9-]+)(\.)([a-z]{2,4})(\.?)([a-z]{0,4})+$/;
    const regExp = new RegExp(pattern);
    return regExp.test(str);
  },
  password: (str: string): boolean => str.trim().length > 3,
  taskname: (str: string): boolean => str.trim().length > 3,
  description: (str: string): boolean => str.trim().length > 3,
  deadline: (str: string): boolean => str.trim().length === 16,
  // TODO refactor deadline no may be less then new Date();
  assignee: (str: string): boolean => str.trim().length > 3,
};

export default validate;
