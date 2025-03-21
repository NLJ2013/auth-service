export default () => ({
  serviceName: 'Auth Service',
  port: 3000,
  database: {
    uri:
      process.env.DB_URI ||
      'mongodb://127.0.0.1:27017/njaydb?directConnection=true&serverSelectionTimeoutMS=2000',
  },
  namespace: process.env.NAMESPACE || 'development',
  jwt: {
    secret:
      process.env.JWT_SECRET ||
      '2eff57555e2291d5743f4ecf03f9fdce68095ad19d59dd022e5111dea479e4053b5f4448f8fd7f332b770c55110762375c43b6e54bf53417f370e5581609a74e926be2c4a1f8903fcb34752d54b5c9a71770e1d2011cd882e03ee92e025f8b537b48493ff101a4dd495d42da26496418d839c9b644383da46ccb226ba86435d0872fb06f14ca9cf3dc6c77e8a5466553f24baa555061eaa964045fa2c42fdb30',
    expiresIn: process.env.JWT_EXPIRES_IN || '60s',
    refreshSecret: process.env.JWT_REFRESH_SECRET || "acf1dd53e7857a3f8f4d8fb45e385da7da84f23e2bf3da6705687fe412c645c60b6c56e9c07bcf16c531dfc45a8325a5cab7a45f058d6efd58236ba7ae57f107",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    refreshTokenExpiresInNumber:
      process.env.JWT_REFRESH_EXPIRES_IN_NUMBER || 7,
  },
});
