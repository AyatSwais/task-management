import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import {JwtAuthGuard} from '../auth/jwt-auth.guard.js';
import {
  Body,
  UseGuards,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { UseFilters } from '@nestjs/common';
import { TaskExceptionFilter } from './task-exception.filter.js';
import { TasksService } from './tasks.service.js';
import { User } from '../auth/user.decorator.js';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
@UseFilters(TaskExceptionFilter)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
// GET /tasks/me
@Get('me')
getMe(@User() user: any) {
  return user;
}


  // GET /tasks
  @Get()
  findAll(@Query('status')status?: string,@Query('assignee') assignee?: string , @Query('project') project?: string) {
    return this.tasksService.findAll(status,assignee,project);
  }

  // GET /tasks/:id
  @Get(':id')
  findOne(@Param('id',ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  // POST /tasks
  @Roles('MANAGER')
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() taskData: CreateTaskDto) {
    return this.tasksService.create(taskData);
  }

  // PATCH /tasks/:id
  @Patch(':id')
  update(@Param('id',ParseIntPipe) id: number , @Body() taskData: UpdateTaskDto) {
    return this.tasksService.update(id, taskData);
  }

  // DELETE /tasks/:id
  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
