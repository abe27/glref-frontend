/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    APP_NAME: `${process.env.APP_NAME}`,
    URL_HOST: `${process.env.API_HOST}`,
    API_HOST: `${process.env.API_HOST}/api/v1`,
    BRACH_ID: process.env.BRACH_ID,
    JOB_ID: process.env.JOB_ID,
    CORP_ID: process.env.CORP_ID,
    PROJ_ID: process.env.PROJ_ID,
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

module.exports = nextConfig;
