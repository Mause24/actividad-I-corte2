import { Router } from "express"
import { createNewRegister, getFormController } from "../controllers"

export const basicRouter = Router()

basicRouter.get("/", getFormController)

basicRouter.post("/user", createNewRegister)
