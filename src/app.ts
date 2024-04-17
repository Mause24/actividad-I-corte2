import cors from "cors"
import express from "express"
import morgan from "morgan"
import path from "path"
import config from "./config"
//ROUTERS
import { basicRouter } from "./routes"

const app = express()

//CONFIG
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }))
app.use("/api/static", express.static(path.join(__dirname, "../public")))

//ROUTES
app.use("/api", basicRouter)
//LISTEN
app.listen(config.PORT, () => {
    console.log("App listen on port " + config.PORT)
})
