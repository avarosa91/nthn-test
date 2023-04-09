export default {
  list: '/v1/stats/packages',
  package: (name) => `/v1/packages/npm/${name}`,
};
