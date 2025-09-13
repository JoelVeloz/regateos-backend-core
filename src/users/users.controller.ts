import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchDto } from './dto/search.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. CREAR usuario (sign up)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  // 2. VER todos los usuarios
  @Get()
  getAllUsers(@Query() data: SearchDto) {
    return this.usersService.getAllUsers(data);
  }

  // 3. VER usuario por ID
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
