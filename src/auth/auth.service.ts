import { 
  Injectable, 
  UnauthorizedException 
} from '@nestjs/common'
import { 
  CreateUserDto,
  LoginUserDto 
} from './dto'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ErrorRequestProvider } from 'src/providers/error-request.provider'
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './interface/jwt-payload'
import { JwtService } from '@nestjs/jwt'


/* The AuthService class in TypeScript provides methods for creating and logging in users, handling
authentication with JWT tokens and bcrypt password hashing. */
@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly errorRequestProvider: ErrorRequestProvider,

    private readonly jwtService: JwtService

  ){}

/**
 * The function creates a new user, hashes the password, saves the user to the database, and returns a
 * success message along with the user data and a JWT token.
 * @param {CreateUserDto} createUserDto - The `createUserDto` parameter in the `create` method likely
 * represents a data transfer object (DTO) containing information needed to create a new user. It may
 * include properties such as `email`, `username`, `password`, and any other relevant user details.
 * @returns The `create` method is returning an object with the following properties:
 * - "message": "User create successfully"
 * - "user": the newly created user object
 * - "token": a JWT token generated using the user's email address
 */
  async create(createUserDto: CreateUserDto) {
    
    try{

      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password,10 )
      })

      await this.userRepository.save(user)

      return {
        "message":"User create successfully",
        user,
        token:this.getJwtToken({
          email: user.email
        })
      }
      
    }catch(error){
      this.errorRequestProvider.handleDBException(error)
    }

  }

/**
 * The login function in TypeScript checks the user credentials, returns a welcome message with user
 * details, and generates a JWT token upon successful login.
 * @param {LoginUserDto} loginUserDto - The `loginUserDto` parameter in the `login` function is an
 * object that contains the user's email and password. It is used to authenticate and log in a user by
 * checking their credentials against the database. The `email` and `password` properties are extracted
 * from this object to find the
 * @returns The `login` function is returning an object with three properties:
 * 1. A "message" property welcoming the user by their full name.
 * 2. A "user" property containing the user object retrieved from the database.
 * 3. A "token" property containing a JWT token generated using the user's email address.
 */
  async login( loginUserDto:LoginUserDto ){

    const { email,password } = loginUserDto

    const user = await this.userRepository.findOne({
      where: {email},
      select:{
        email: true,
        fullName:true,
        password: true
      }
    })

    if( !user ){
      throw new UnauthorizedException('User dont found')
    }

    if( !bcrypt.compareSync(password, user.password) ){
      throw new UnauthorizedException('Password doesnt match')
    }

    return {
      "message":`Bienvenido ${user.fullName}`,
      user,
      token:this.getJwtToken({
        email: user.email
      })
    }

  }

/**
 * The function `getJwtToken` generates a JWT token using the provided payload.
 * @param {JwtPayload} payload - The `payload` parameter in the `getJwtToken` function is of type
 * `JwtPayload`. It is the data that will be used to generate a JSON Web Token (JWT) using the
 * `jwtService.sign` method.
 * @returns A JWT token is being returned.
 */
  private getJwtToken( payload: JwtPayload ){

    return this.jwtService.sign(payload)

  }

}
