import { Module } from '@nestjs/common';
import { AdminUsersController } from './controllers/admin_users.controller';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, AdminUsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
