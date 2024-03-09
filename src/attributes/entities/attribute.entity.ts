
import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn 
} from "typeorm"

@Entity()
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
