import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto,LoginUserDto } from './dto';

/* The AuthController class in TypeScript defines routes for user registration, login, and a private
testing route. */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

/* This code snippet is defining a POST route for user registration in the AuthController class. When a
POST request is made to the '/auth/register' endpoint, the `createUser` method is called. The
`@Post('register')` decorator specifies that this method should be triggered for POST requests to
the '/auth/register' route. */
  @Post('register')
  createUser(@Body() createUserDTO: CreateUserDto) {
    return this.authService.create(createUserDTO);
  }

/* The code snippet you provided is defining a POST route for user login in the `AuthController` class. */
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto)
  }

  @Get()
  testingPrivateRoute(){
    
  }

}
