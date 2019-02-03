export const enabled = true
export const config = {
        port: (process.env.REDIS_PORT) ? parseInt(process.env.REDIS_PORT) : 6379,
        host: (process.env.REDIS_HOST) ? process.env.REDIS_HOST : "127.0.0.1",
        socket_keepalive: true,
        password: undefined
}