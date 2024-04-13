import { Global, Module } from '@nestjs/common';
import { PUB_SUB } from '../constants/injection-tokens';
import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { reviver } from './reviver';

@Global() //Global Module, need to import it once
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useFactory: (configService: ConfigService) => {
        if (configService.get('NODE_ENV') === 'production') {
          const options = {
            host: configService.getOrThrow('REDIS_HOST'),
            port: configService.getOrThrow('REDIS_PORT'),
          };
          return new RedisPubSub({
            publisher: new Redis(options),
            subscriber: new Redis(options),
            reviver: reviver,
          });
        }
        return new PubSub();
      },
      inject: [ConfigService],
    },
  ],
  exports: [PUB_SUB],
})
export class PubSubModule {}
