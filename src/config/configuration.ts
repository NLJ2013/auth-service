export default () => ({
  serviceName: 'Auth Service',
  port: 3000,
  database: {
    uri:
      process.env.HMT_DB_URI ||
      'mongodb://127.0.0.1:27017/njaydb?directConnection=true&serverSelectionTimeoutMS=2000',
  },
  namespace: process.env.NAMESPACE || 'development',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
});
