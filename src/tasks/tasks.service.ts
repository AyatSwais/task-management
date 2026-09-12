import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TasksService {
private tasks = [
    {
    id: 1,
    title: 'إنشاء Login API',
    description: 'إنشاء API لتسجيل دخول المستخدم',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignee: 'Ayat',
    project: 'MedConnect Backend',
    dueDate: '2026-09-20',
    },
    {
    id: 2,
    title: 'إنشاء Register API',
    description: 'إنشاء API لتسجيل مستخدم جديد',
    status: 'TODO',
    priority: 'MEDIUM',
    assignee: 'Ahmad',
    project: 'MedConnect Backend',
    dueDate: '2026-09-22',
    },
    {
    id: 3,
    title: 'إنشاء صفحة المهام',
    description: 'إنشاء واجهة لعرض المهام',
    status: 'DONE',
    priority: 'LOW',
    assignee: 'Sara',
    project: 'Task Management',
    dueDate: '2026-09-25',
    },
];

private nextId = 4;

  // GET /tasks
findAll(status?: string, assignee?: string ,project?: string,) {
  let result = this.tasks;

  if (status) {
    result = result.filter(
      task => task.status === status
    );
  }

  if (assignee) {
    result = result.filter(
      task => task.assignee === assignee
    );
    
  }
  if (project) {
    result = result.filter(
      task => task.project === project
    );
  }

  return result;
}

  // GET /tasks/:id
findOne(id: number) {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
    throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
}

  // POST /tasks
create(taskData: CreateTaskDto) {
    const newTask = {
    id: this.nextId++,
    title: taskData.title,
    description: taskData.description ?? '',
    status: taskData.status ?? 'TODO',
    priority: taskData.priority ?? 'MEDIUM',
    assignee: taskData.assignee ?? '',
    project: taskData.project ?? '',
    dueDate: taskData.dueDate ?? '',
    };

    this.tasks.push(newTask);

    return newTask;
}

  // PATCH /tasks/:id
update(id: number, taskData:UpdateTaskDto) {
    const task = this.findOne(id);

    if (taskData.title !== undefined) {
    task.title = taskData.title;
    }

    if (taskData.description !== undefined) {
    task.description = taskData.description;
    }

    if (taskData.status !== undefined) {
    task.status = taskData.status;
    }

    if (taskData.priority !== undefined) {
    task.priority = taskData.priority;
    }

    if (taskData.assignee !== undefined) {
    task.assignee = taskData.assignee;
    }

    if (taskData.project !== undefined) {
    task.project = taskData.project;
    }

    if (taskData.dueDate !== undefined) {
    task.dueDate = taskData.dueDate;
    }

    return task;
}

  // DELETE /tasks/:id
remove(id: number) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
    throw new NotFoundException(`Task with id ${id} not found`);
    }

    const deletedTask = this.tasks.splice(taskIndex, 1);

    return {
    message: 'Task deleted successfully',
    task: deletedTask[0],
    };
}
}
