export function saveChat(send, to) {
    var key = send +':'+to;
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, key)
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

