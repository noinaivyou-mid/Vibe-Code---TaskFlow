function parseNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseOrigins(value: string | undefined) {
  if (!value) {
    return ['http://localhost:3000'];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env = {
  port: parseNumber(process.env.PORT, 4000),
  corsOrigins: parseOrigins(process.env.CORS_ORIGIN),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'taskflow-dev-access-secret',
  accessTokenTtlMinutes: parseNumber(process.env.ACCESS_TOKEN_TTL_MINUTES, 15),
  refreshTokenTtlDays: parseNumber(process.env.REFRESH_TOKEN_TTL_DAYS, 30),
  refreshCookieName: 'taskflow_refresh_token',
  isProduction: process.env.NODE_ENV === 'production',
};
