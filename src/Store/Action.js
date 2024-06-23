export const getUser = (data) => {
    return {
        type: 'user.get',
        payload: {
            user: data
        }
    }
}

export const setUser = (data) => {
    return {
        type: 'user.set',
        payload: {
            user: data
        }
    }
}

export const getCode = (data) => {
    return {
        type: 'code.get',
        payload: {
            code: data
        }
    }
}

export const setCode = (data) => {
    return {
        type: 'code.set',
        payload: {
            code: data
        }
    }
}