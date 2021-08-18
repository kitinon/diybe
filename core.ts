import "reflect-metadata"
import express from "express"

const GET_PATH_KEY = Symbol("getPath")
const PREFIX_KEY = Symbol("prefix")

export function Router(prefix = '/') {
  return (target: Function) => {
    Reflect.defineMetadata(
      PREFIX_KEY, prefix, target
    )
  }
}
export function Get(path = '/') {
  return (
    target: object,
    propertyKey: string,
    desc: PropertyDescriptor
  ) => {
    Reflect.defineMetadata(
      GET_PATH_KEY, path, target,
      propertyKey
    )
  }
}

type Constructor = new(...args: any[])=>any

export function bootstrap(ctor: Constructor) {
  const _router = new ctor()
  const router = express.Router()
  const proto = ctor.prototype
  const props = Object.getOwnPropertyNames(proto)
  for (const prop of props) {
    let path = Reflect.getMetadata(
      GET_PATH_KEY, proto, prop
    )
    if (path) {
      router.get(path, (req, res) => {
        res.send(_router[prop]()) // prop = 'greeting'
      })
    }
  }
  const app = express()
  const prefix = Reflect.getMetadata(PREFIX_KEY, ctor)
  app.use(prefix, router)
  return app
}
