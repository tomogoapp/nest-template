
/* The `import` statement in TypeScript is used to import functionalities from external modules or
files. In this case, the statement is importing specific elements (`BadRequestException`, `Inject`,
`Injectable`, `InternalServerErrorException`, `Logger`) from the `@nestjs/common` module. */
import { 
    BadRequestException,
    Inject,
    Injectable, 
    InternalServerErrorException, 
    Logger 
} from '@nestjs/common'

/* The `DBError` interface defines the structure of an error object that is related to a database
operation. It has two properties: */
interface DBError {
    code: string;
    detail?: string;
}

/* The ErrorRequestProvider class handles database exceptions by throwing specific exceptions based on
the error code and logs the error if it is not a known code. */
@Injectable()
export class ErrorRequestProvider{
    private readonly logger: Logger

    constructor(
        @Inject('ServiceName')
        private readonly serviceName: string  
    ) {
        this.logger = new Logger(serviceName)
    }

/**
 * The function handles database exceptions by throwing specific exceptions based on the error code,
 * and logs the error if it is not a known code.
 * @param {T} error - The `error` parameter is of type `T`, which extends `DBError`.
 */
    handleDBException<T extends DBError>(error: T): never{
        if(error.code === '23505') {
            throw new BadRequestException(error.detail)
        }
        this.logger.error(error)
        throw new InternalServerErrorException('Unexpected Error')
    }
}