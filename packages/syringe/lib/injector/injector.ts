import { cache } from "../Cache/Cache"

export function injector<T extends new (...args: any) => InstanceType<T>>(Class: T, ...args: ConstructorParameters<T>) {
    const instance = new Class(...args)

    cache.set(Class.name, instance)

    return instance
}