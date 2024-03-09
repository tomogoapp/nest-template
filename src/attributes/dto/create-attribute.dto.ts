
import { 
    IsString, 
    MinLength 
} from "class-validator"

export class CreateAttributeDto {

    @IsString()
    @MinLength(1)
    name: string

    @IsString()
    @MinLength(1)
    image: string

}
