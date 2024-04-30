import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

/* The above class defines a User entity with various properties such as id, email, backupEmail,
password, fullName, isActive, roles, and includes before insert and update hooks to convert email to
lowercase. */
@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text',{
        unique:true
    })
    email: string

    @Column('text',{
        nullable: true
    })
    backupEmail: string

    @Column('text',{
        select: false
    })
    password: string

    @Column('text')
    fullName: string

    @Column('bool',{
        default: true
    })
    isActive: boolean

    @Column('text',{
        array: true,
        default: ['user']
    })
    roles: string[]

    // @OneToMany(
    //     () => Product,
    //     ( product ) => product.user
    // )
    // product: Product

    @BeforeInsert()
    lowerCaseBeforeInsert(){
        this.email = this.email.toLocaleLowerCase().trim()
    }

    @BeforeUpdate()
    lowerCaseBeforeUpdate(){
        this.lowerCaseBeforeInsert()
    }

}
