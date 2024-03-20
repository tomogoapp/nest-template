import { 
    IsEmail,
    IsOptional, 
    IsString, 
    Matches, 
    MaxLength, 
    MinLength 
} from "class-validator"

/* The `CreateUserDto` class in TypeScript defines properties for creating a user with email, backup
email, password, and full name, with validation decorators for string, email, password strength, and
full name length. */
export class CreateUserDto {

    @IsString()
    @IsEmail()
    email: string

    @IsString()
    @IsEmail()
    @IsOptional()
    backupEmail?: string

    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string

    @IsString()
    @MinLength(1)
    fullName: string

}