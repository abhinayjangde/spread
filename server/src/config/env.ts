const _env = {
    port: process.env.PORT || 9000,
    jwtSecret: process.env.JWT_SECRET
}

const env = Object.freeze(_env);

export default env;