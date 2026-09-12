import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports :[PassportModule.register({
  defaultStrategy: 'jwt',
}),],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
