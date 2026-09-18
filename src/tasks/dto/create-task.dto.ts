// import {
//   IsDateString,
//   IsIn,
//   IsInt,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
// } from 'class-validator';

// export class CreateTaskDto {
//   @IsString()
//   @IsNotEmpty()
//   title: string;

//   @IsString()
//   @IsOptional()
//   description?: string;

//   @IsIn(['TODO', 'IN_PROGRESS', 'DONE'])
//   @IsOptional()
//   status?: string;

//   @IsIn(['LOW', 'MEDIUM', 'HIGH'])
//   @IsOptional()
//   priority?: string;

//   @IsInt()
//   @IsOptional()
//   assigneeId?: number;

//   @IsString()
//   @IsOptional()
//   project?: string;

//   @IsDateString()
//   @IsOptional()
//   dueDate?: string;
// }
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import {
  TaskPriority,
  TaskStatus,
} from '../../generated/prisma/client.js';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsInt()
  @IsOptional()
  assigneeId?: number;

  @IsString()
  @IsOptional()
  project?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
