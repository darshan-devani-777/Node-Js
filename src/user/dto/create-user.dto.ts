export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    readonly role?: string;
  }
  