const NodeCache = require("node-cache")
const cache = new NodeCache()

module.exports = (duration) => (req, res, next) => {
    if (req.method !== "GET") {
        return next()
    }

    const key = req.originalUrl
    const cachedResponse = cache.get(key)

    if (cachedResponse) {
        return res.json(JSON.parse(cachedResponse))
    } else {
        res.originalSend = res.send
        res.send = (body) => {
            res.originalSend(body)
            cache.set(key, body, duration)
        }
    }
    next()
}
