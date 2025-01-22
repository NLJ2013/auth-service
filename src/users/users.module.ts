import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.model';
import { UserSecret, UserSecretSchema } from './models/user-secret.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserSecret.name, schema: UserSecretSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
