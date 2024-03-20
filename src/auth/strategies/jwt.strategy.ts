import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interface/jwt-payload";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";


/* The JwtStrategy class in TypeScript is used for validating JWT tokens and retrieving user
information based on the payload. */
@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService
        
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

/**
 * The function `validate` in TypeScript validates a JWT payload by checking if the user associated
 * with the email in the payload exists and is active.
 * @param {JwtPayload} payload - The `payload` parameter in the `validate` function is an object of
 * type `JwtPayload`. It likely contains information extracted from a JSON Web Token (JWT), such as the
 * user's email address.
 * @returns The `validate` function is returning a Promise that resolves to a `User` object.
 */
    async validate( payload: JwtPayload ): Promise<User> {

        const { email } = payload
        
        const user = await this.userRepository.findOne({
            where:{
                email
            }
        })

        if(!user){
            throw new UnauthorizedException('toke not valid')
        }
        if(!user.isActive){
            throw new UnauthorizedException('User is inactive, contact with the admin')
        }

        return user
    }

}
