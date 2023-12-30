export default {
  get: async (path: any, options?: any) => axios.get(path, { params: options }),
  create: (path: any, item: any, config = {}) => axios.post(path, item, config),
  update: (path: any, item: any, config?: any) => axios.put(path, item, config),
  delete: (path: any) => axios.delete(path)
};
