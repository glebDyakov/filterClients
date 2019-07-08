export const createSocket = (staffId) => {
    return new WebSocket(`wss://staging.online-zapis.com/websocket/${staffId}/`);
}
