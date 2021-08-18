import {
  Router,Get, bootstrap
} from './core'

@Router()
class Hello {
  @Get() greeting(): string {
    return 'Hello, world!'
  }
}
bootstrap(Hello).listen(3000)
