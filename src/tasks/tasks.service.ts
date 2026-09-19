// import { CreateTaskDto } from './dto/create-task.dto.js';
// import { UpdateTaskDto } from './dto/update-task.dto.js';
// import { Injectable, NotFoundException } from '@nestjs/common';

// @Injectable()
// export class TasksService {
//   private tasks = [
//     {
//       id: 1,
//       title: 'إنشاء Login API',
//       description: 'إنشاء API لتسجيل دخول المستخدم',
//       status: 'IN_PROGRESS',
//       priority: 'HIGH',
//       assignee: 'Ayat',
//       project: 'MedConnect Backend',
//       dueDate: '2026-09-20',
//     },
//     {
//       id: 2,
//       title: 'إنشاء Register API',
//       description: 'إنشاء API لتسجيل مستخدم جديد',
//       status: 'TODO',
//       priority: 'MEDIUM',
//       assignee: 'Ahmad',
//       project: 'MedConnect Backend',
//       dueDate: '2026-09-22',
//     },
//     {
//       id: 3,
//       title: 'إنشاء صفحة المهام',
//       description: 'إنشاء واجهة لعرض المهام',
//       status: 'DONE',
//       priority: 'LOW',
//       assignee: 'Sara',
//       project: 'Task Management',
//       dueDate: '2026-09-25',
//     },
//   ];

//   private nextId = 4;

//   // GET /tasks
//   findAll(status?: string, assignee?: string, project?: string) {
//     let result = this.tasks;

//     if (status) {
//       result = result.filter((task) => task.status === status);
//     }

//     if (assignee) {
//       result = result.filter((task) => task.assignee === assignee);
//     }
//     if (project) {
//       result = result.filter((task) => task.project === project);
//     }

//     return result;
//   }

//   // GET /tasks/:id
//   findOne(id: number) {
//     const task = this.tasks.find((task) => task.id === id);

//     if (!task) {
//       throw new NotFoundException(`Task with id ${id} not found`);
//     }

//     return task;
//   }

//   // POST /tasks
//   create(taskData: CreateTaskDto) {
//     const newTask = {
//       id: this.nextId++,
//       title: taskData.title,
//       description: taskData.description ?? '',
//       status: taskData.status ?? 'TODO',
//       priority: taskData.priority ?? 'MEDIUM',
//       assignee: taskData.assignee ?? '',
//       project: taskData.project ?? '',
//       dueDate: taskData.dueDate ?? '',
//     };

//     this.tasks.push(newTask);

//     return newTask;
//   }

//   // PATCH /tasks/:id
//   update(id: number, taskData: UpdateTaskDto) {
//     const task = this.findOne(id);

//     if (taskData.title !== undefined) {
//       task.title = taskData.title;
//     }

//     if (taskData.description !== undefined) {
//       task.description = taskData.description;
//     }

//     if (taskData.status !== undefined) {
//       task.status = taskData.status;
//     }

//     if (taskData.priority !== undefined) {
//       task.priority = taskData.priority;
//     }

//     if (taskData.assignee !== undefined) {
//       task.assignee = taskData.assignee;
//     }

//     if (taskData.project !== undefined) {
//       task.project = taskData.project;
//     }

//     if (taskData.dueDate !== undefined) {
//       task.dueDate = taskData.dueDate;
//     }

//     return task;
//   }

//   // DELETE /tasks/:id
//   remove(id: number) {
//     const taskIndex = this.tasks.findIndex((task) => task.id === id);

//     if (taskIndex === -1) {
//       throw new NotFoundException(`Task with id ${id} not found`);
//     }

//     const deletedTask = this.tasks.splice(taskIndex, 1);

//     return {
//       message: 'Task deleted successfully',
//       task: deletedTask[0],
//     };
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';

import {
  TaskPriority,
  TaskStatus,
} from '../generated/prisma/client.js';

import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /tasks
  async findAll(
    status?: TaskStatus,
    assigneeId?: number,
    project?: string,
  ) {
    return this.prisma.task.findMany({
      where: {
        ...(status && { status }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(project && { project }),
      },
            include: {
  assignee: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
},
    });
  }

  // GET /tasks/:id
  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
            include: {
  assignee: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
},
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  // POST /tasks
  async create(taskData: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description ?? '',
        status: taskData.status ?? TaskStatus.TODO,
        priority: taskData.priority ?? TaskPriority.MEDIUM,
        assigneeId: taskData.assigneeId,
        project: taskData.project ?? '',
        dueDate: taskData.dueDate
          ? new Date(taskData.dueDate)
          : null,
      },
            include: {
  assignee: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
},
    });
  }

  // PATCH /tasks/:id
  async update(id: number, taskData: UpdateTaskDto) {
    const existingTask = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(taskData.title !== undefined && {
          title: taskData.title,
        }),

        ...(taskData.description !== undefined && {
          description: taskData.description,
        }),

        ...(taskData.status !== undefined && {
          status: taskData.status,
        }),

        ...(taskData.priority !== undefined && {
          priority: taskData.priority,
        }),

        ...(taskData.assigneeId !== undefined && {
          assigneeId: taskData.assigneeId,
        }),

        ...(taskData.project !== undefined && {
          project: taskData.project,
        }),

        ...(taskData.dueDate !== undefined && {
          dueDate: taskData.dueDate
            ? new Date(taskData.dueDate)
            : null,
        }),
      },
      include: {
  assignee: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
},
    });
  }

  // DELETE /tasks/:id
  async remove(id: number) {
    const existingTask = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    const deletedTask = await this.prisma.task.delete({
      where: { id },
    });

    return {
      message: 'Task deleted successfully',
      task: deletedTask,
    };
  }
}
