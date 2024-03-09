
import { 
    Column, 
    PrimaryGeneratedColumn 
} from "typeorm"

export class Attribute {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text',{
        nullable: false,
    })
    name: string

    @Column('text',{
        nullable: false,
    })
    image: string

}
