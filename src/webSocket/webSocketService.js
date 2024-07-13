    const WebSocketService = (() => {
    let socket;
    let callbacks = {};

    const connect = (url) => {
        socket = new WebSocket(url);
        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            // console.log(event)
            const data = JSON.parse(event.data);
            (data.data && data.event == 'LOGIN') ? callbacks[data.event](data.data.RE_LOGIN_CODE || data.mes) : callbacks[data.event](data.data || data.mes)
        };

        socket.onclose = () => {
            console.log('WebSocket closed');
        };

        socket.onerror = (error) => {
            console.log('WebSocket error', error);
        };
    };

    const registerCallback = (event, callback) => {
        callbacks[event] = callback;
    };

        const unregisterCallback = (event) => {
            if (event in callbacks) {
                delete callbacks[event];
                console.log(`Unregistered callback for event '${event}' successfully.`);
            } else {
                console.warn(`Callback for event '${event}' does not exist.`);
            }
        };

    const sendMessage = (message) => {
        try {
            socket.send(JSON.stringify(message));
            // console.log(message)
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const close = () => {
        socket.onclose();
    }


    return {
        connect,
        registerCallback,
        unregisterCallback,
        sendMessage,
        close
    };
})();

export default WebSocketService;


