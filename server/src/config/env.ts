import dotenv from 'dotenv';
dotenv.config({
    path: "./.env"
});

const _env = {
    port: process.env.PORT || 9000,
    jwtSecret: process.env.JWT_SECRET,
    aws: {
        s3AccessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        s3SecretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        s3Region: process.env.AWS_S3_REGION,
        s3BucketName: process.env.AWS_S3_BUCKET_NAME,
    },
    redisUrl: process.env.REDIS_URL,
    databaseUrl: process.env.DATABASE_URL,
}

const env = Object.freeze(_env);

export default env;