
export const createSocket = (staffId) => {
    return new WebSocket(`wss://staging.online-zapis.com/websocket/${staffId}/`);
}

// import io from 'socket.io-client';
// export const createSocket = (staffId) => {
//
//     return io(`wss://staging.online-zapis.com/websocket/`, {
//         path: `/websocket/${staffId}/`,
//         transports: ['websocket']
//
//     });
// }
