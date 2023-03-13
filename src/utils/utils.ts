// @ts-nocheck

// Analytics

export type JoinedObject<T> = {
    [key: string]: Array<T>
}

export function getDeepValue(object: Object, ...args: string[]): any {
    if (object.hasOwnProperty(args[0])) {
        if (args.length === 1) return object[args[0]]
        return getDeepValue(object[args[0]], ...args.slice(1))
    } 
}

export function joinByProperty<T extends Object>(array: Array<T>, ...args: string[]): JoinedObject<T> {
    return array.reduce((acc, item) => {
        const property = getDeepValue(item, ...args)
        if (!property) return acc

        if (!acc.hasOwnProperty(property)) {
            acc[property] = [item]
        } else {
            acc[property].push(item)
        }
       
        return acc
    }, {} as JoinedObject<T>) 
}

















const stringToColor = (string: string) => {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff
        color += `00${value.toString(16)}`.slice(-2)
    }
    /* eslint-enable no-bitwise */

    return color
}

export const stringAvatar = (name: string) => {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.toUpperCase().split(' ')[0][0]}${name.toUpperCase().split(' ')[1][0]}`,
    }
}