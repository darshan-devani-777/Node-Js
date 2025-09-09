import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../model/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}  

  // CREATE USER
  async createUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const createdUser = new this.userModel({
      ...dto,
      password: hashedPassword,
      role: dto.role || 'user',
    });
    const savedUser = await createdUser.save();

    return {
      success: true,
      message: 'User Created Successfully...',
      data: { id: savedUser._id, name: savedUser.name, email: savedUser.email, role: savedUser.role },
    };
  }

  // LOGIN USER
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
  
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const payload = { sub: user._id, email: user.email, role: user.role };
  
    const token = await this.jwtService.signAsync(payload);
  
    return {
      success: true,
      message: 'User Login Successfully...',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }  

  // GET ALL USER
  async getAllUsers() {
    const users = await this.userModel.find({}, '-password');
    return {
      success: true,
      message: "User's Fetched Successfully...",
      data: users,
    };
  }

  // GET SPECIFIC USER 
  async getUserById(id: string) {
    const user = await this.userModel.findById(id, '-password');
    if (!user) return { success: false, message: 'User not found', data: null };

    return {
      success: true,
      message: "User Fetched Successfully...",
      data: user,
    };
  }

  // UPDATE USER
  async updateUser(id: string, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    const updatedUser = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
      select: '-password',
    });
    if (!updatedUser) return { success: false, message: 'User not found', data: null };

    return {
      success: true,
      message: 'User Updated Successfully...',
      data: updatedUser,
    };
  }

  // DELETE USER
  async deleteUser(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) return { success: false, message: 'User not found', data: null };

    return {
      success: true,
      message: 'User Deleted Successfully...',
      data: deleted,
    };
  }
}
