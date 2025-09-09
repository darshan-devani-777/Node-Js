import {Controller,Get,Param,Post,Put,Delete,Body,UseGuards} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../auth/roleDecorator';
import { RolesGuard } from '../../auth/roleGuard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // CREATE USER
  @Post('create-user')
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  // LOGIN USER
  @Post('login-user')
  async login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body.email, body.password);
  }

  // GET ALL USER
  @UseGuards(AuthGuard('jwt'))
  @Get('get-all-user')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // GET SPECIFIC USER (ADMIN ONLY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin')
  @Get('get-specific-user/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  // UPDATE USER (ADMIN ONLY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin')
  @Put('update-user/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  // DELETE USER (ADMIN ONLY)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Role('admin')
  @Delete('delete-user/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
