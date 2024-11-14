import { cache } from "../Cache/Cache";

export function useDeps<T extends new (...args: any) => InstanceType<T>>(Class: T) {
    const getter = cache.get(Class.name)

    if(!getter) throw new Error("That class is not registered for injection")

    return getter as InstanceType<T>
}