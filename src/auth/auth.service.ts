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


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly errorRequestProvider: ErrorRequestProvider,

    private readonly jwtService: JwtService

  ){}

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


  private getJwtToken( payload: JwtPayload ){

    return this.jwtService.sign(payload)

  }

}
