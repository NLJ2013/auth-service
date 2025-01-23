import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as config from './config/configuration';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(config.default().database.uri),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
