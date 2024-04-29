import { uuid } from "aws-sdk/clients/customerprofiles"

export interface JwtPayload {
    id: uuid
    email: string,
    username: string,
    is_active:  boolean,
    roles: string[]
}