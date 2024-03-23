import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { DbMigrationService } from './db-migration.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [DbMigrationService],
})
export class DatabaseModule {
  //generate DynamicModule for Mongoose DB based on specific {name: UserDocument.name, schema: UserSchema}
  //This dynamic module can register multiple models (User, Action, etc)
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
