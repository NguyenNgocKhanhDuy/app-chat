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

export function getReceive(send, to) {
    var key = send +':'+to;
    if (localStorage.getItem(key)) {
        var to = JSON.stringify(localStorage.getItem(key)).split(":")[1]
        return to;
    }
}