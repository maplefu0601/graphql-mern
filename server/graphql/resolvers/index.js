//graphql/resolvers/index.js

import * as authHandlers from './handlerGenerators/auth';

export default {
  ...authHandlers,
};
