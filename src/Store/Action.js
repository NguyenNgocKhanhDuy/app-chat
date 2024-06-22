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

