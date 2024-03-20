
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorRequestProvider } from 'src/providers/error-request.provider';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { 
  ConfigModule, 
  ConfigService 
} from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

/* This code snippet is defining an `@Module` decorator in a NestJS module file. The `@Module`
decorator is used to define the properties of the module such as controllers, providers, imports,
and exports. */
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    ErrorRequestProvider,
    { 
      provide: 'ServiceName', 
      useValue: 'ErrorRequestProvider' 
    }
  ],
  imports:[

    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    ConfigModule,

    JwtModule.registerAsync({
      imports: [
        ConfigModule
      ],
      inject: [
        ConfigService
      ],
      useFactory: ( configService:ConfigService ) => {
        return {
          // secret: process.env.JWT_SECRET,
          secret:configService.get('JWT_SECRET'),
          signOptions:{
            expiresIn:'2h'
          }        
        }
      }

    })

  ],
  exports:[
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule
  ]
})

export class AuthModule {}
