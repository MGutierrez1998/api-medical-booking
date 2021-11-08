require("dotenv").config()
require("express-async-errors")

// security
const cors = require("cors")
const helmet = require("helmet")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")

// swagger
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDocument = YAML.load("./swagger.yaml")

// server & db
const express = require("express")
const app = express()
const connectDB = require("./db/connect")
const path = require("path")

// middleware
const notFoundMiddleware = require("./middleware/not-found")
const errorHandlerMiddleware = require("./middleware/error-handler")

// routes
const authRouter = require("./routes/auth")
const userRouter = require("./routes/user")
const locationRouter = require("./routes/location")
const doctorRouter = require("./routes/doctor")
const bookingRouter = require("./routes/booking")
const diagnoseRouter = require("./routes/diagnose")
const procedureRouter = require("./routes/procedure")
const departmentRouter = require("./routes/department")
const authenticateUser = require("./middleware/authentication")

// dev dependencies: comment out in prod
app.use(require("morgan")("dev"))

// security
app.set("trust proxy", 1)
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000, // 15 mins
        max: 100, // limit each IP to 100 requests per windowMs
    })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(helmet())
app.use(cors())
app.use(xss())

// api routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", authenticateUser, userRouter)
app.use("/api/v1/location", authenticateUser, locationRouter)
app.use("/api/v1/doctor", authenticateUser, doctorRouter)
app.use("/api/v1/booking", authenticateUser, bookingRouter)
app.use("/api/v1/diagnose", authenticateUser, diagnoseRouter)
app.use("/api/v1/procedure", authenticateUser, procedureRouter)
app.use("/api/v1/department", authenticateUser, departmentRouter)

// web routes
app.use(express.static(path.join(__dirname, "public")))
app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"))
})

app.use("/api", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// error handlers
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// connect database and initialize server
const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()
