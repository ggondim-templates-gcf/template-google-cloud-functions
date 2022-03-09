import pkg from '../package.json';

export default {
  openapi: '3.0.2',
  info: {
    title: pkg.name,
    description: pkg.description,
    version: pkg.version,
  },
};
