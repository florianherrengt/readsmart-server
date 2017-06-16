import redis from 'redis';
import bluebird from 'bluebird';
import config from '../../config';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export const redisClient = redis.createClient(config.redis);

redisClient.on('error', err => {
    console.log('Redis error ' + err);
});
