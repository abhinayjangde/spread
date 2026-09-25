import { Redis } from "ioredis"
import env from "../config/env.js";

export const redis = new Redis(env.redisUrl as string, {
    maxRetriesPerRequest: 1,      // don't re-send commands 20x
    enableOfflineQueue: false,    // fail fast instead of queueing
    retryStrategy(times) {
        if (times > 10) return null;        // stop reconnecting forever
        return Math.min(times * 500, 5000);
    },
});

redis.on("error", (e) => console.error("Redis error:", e.message));