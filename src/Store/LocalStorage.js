export function saveChat(send, to) {
    var key = send +':'+to;
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, key)
    }
}

export function saveUser(user) {
    var key = "user";
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, user)
    }
}

export function saveCode(code) {
    var key = "code";
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, code)
    }
}

export function getCode() {
    var key = "code";
    if (!localStorage.getItem(key)) {
        return localStorage.getItem(key)
    }
}
export function getUser() {
    var key = "user";
    if (!localStorage.getItem(key)) {
        return localStorage.getItem(key)
    }
}

export function removeChat(send, to) {
    var key = send +':'+to;
    localStorage.removeItem(key)
}

export function getChat(send, to) {
    var key = send +':'+to;
    if (localStorage.getItem(key)) {
        return JSON.stringify(localStorage.getItem(key))
    }else {
        return ""
    }
}



