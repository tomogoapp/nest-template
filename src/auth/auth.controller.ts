import { 
  Controller, 
  Get, Post, 
  Body,
  UseGuards, 
  Req,
  Headers,
  SetMetadata
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto,LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, RawHeaders } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProctected,Auth } from './decorators';
import { validRoles } from './interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

/* The `createUser` method in the `AuthController` class is a handler for the POST request to the
'/auth/register' endpoint. */
  @Post('register')
  createUser(@Body() createUserDTO: CreateUserDto) {
    return this.authService.create(createUserDTO);
  }

/* The `loginUser` method in the `AuthController` class is a handler for the POST request to the
'/auth/login' endpoint. */
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto)
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user)
  }


/* The `testingPrivateRoute` method in the `AuthController` class is a handler for the GET request to
the '/auth/private' endpoint. Here's a breakdown of what it does: */
  @Get('private')
  @UseGuards(AuthGuard())
/**
 * The function `testingPrivateRoute` retrieves user information and headers for a private route in
 * TypeScript.
 * @param {User} user - The `user` parameter is decorated with `@GetUser()`, which means it will
 * retrieve the user object from the request context. This could be useful for accessing user
 * information in a protected route where authentication is required.
 * @param {string} userEmail - The `userEmail` parameter in the `testingPrivateRoute` function is a
 * string that represents the email of the user obtained using the `@GetUser('email')` decorator. This
 * decorator is likely used to extract specific user information from the request context in a NestJS
 * application. In this case
 * @param {string} userFullName - The `userFullName` parameter in the `testingPrivateRoute` function is
 * decorated with `@GetUser('fullName') userFullName: string`. This means that it is retrieving the
 * full name of the user from the request.
 * @param {string} userId - The `userId` parameter in the `testingPrivateRoute` function is obtained
 * using the `@GetUser('id') userId: string` decorator. This decorator is likely used to extract the
 * user's ID from the request context or headers. The `userId` variable will contain the user's ID as
 * @param {string[]} rawHeaders - The `rawHeaders` parameter in your `testingPrivateRoute` function is
 * of type `string[]`. This parameter is used to access the raw headers of the incoming HTTP request.
 * The raw headers are the headers as they were received from the client, without any parsing or
 * modification.
 * @param {IncomingHttpHeaders} headers - It looks like you have defined a method `testingPrivateRoute`
 * with several parameters. Here's a breakdown of the parameters you have defined:
 * @returns The function `testingPrivateRoute` is returning an object with the following properties:
 * - `user`: User object obtained from the `@GetUser()` decorator
 * - `userEmail`: Email string obtained from the `@GetUser('email')` decorator
 * - `userFullName`: Full name string obtained from the `@GetUser('fullName')` decorator
 * - `userId`: User ID string
 */
  testingPrivateRoute(
    //@Req() request: Express.Request
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @GetUser('fullName') userFullName: string,
    @GetUser('id') userId: string,

    @RawHeaders() rawHeaders:string[],
    @Headers() headers: IncomingHttpHeaders
  ){
  
    return{
      user,
      userEmail,
      userFullName,
      userId,
      rawHeaders,
      headers
    }
  }

/* The `privateRoute2` method in the `AuthController` class is a handler for the GET request to the
'/auth/private2' endpoint. Here's a breakdown of what it does: */
  @Get('private2')
  @RoleProctected(validRoles.user,validRoles.admin,validRoles.superUser)
  @UseGuards(AuthGuard(), UserRoleGuard)

/**
 * The privateRoute2 function returns an object with a boolean value and the user object obtained from
 * the GetUser decorator.
 * @param {User} user - The `user` parameter in the `privateRoute2` function is decorated with
 * `@GetUser()`, which likely means that it is a custom decorator or middleware used to retrieve the
 * user object associated with the current request. The `user` parameter is expected to be an instance
 * of the `User
 * @returns The `privateRoute2` function is returning an object with two properties: `ok` set to
 * `true`, and `user` which contains the `User` object obtained from the `@GetUser()` decorator.
 */
  privateRoute2(
    @GetUser() user: User
  ){
    return {
      ok: true,
      user
    }
  }


/* The `private3` method in the `AuthController` class is a handler for the GET request to the
'/auth/private3' endpoint. Here's a breakdown of what it does: */
  @Get('private3')
  @Auth(validRoles.admin)
/**
 * The private3 function returns an object with a boolean value and the user object obtained from the
 * GetUser decorator.
 * @param {User} user - The `user` parameter in the `private3` function is decorated with `@GetUser()`,
 * which suggests that it is a decorator used to retrieve the user object. The function returns an
 * object with a boolean property `ok` set to `true` and includes the `user` object in
 * @returns The function `private3` is returning an object with two properties: `ok` set to `true`, and
 * `user` which contains the `User` object passed as a parameter.
 */
  private3(
    @GetUser() user: User
  ){
    return {
      ok: true,
      user
    }
  }

}
