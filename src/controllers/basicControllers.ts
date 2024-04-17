import { Request, Response } from "express"
import fs from "fs"
import path from "path"
import { RegisterInterface } from "../interfaces"

export const getFormController = (_: Request, res: Response) => {
    res.status(200).sendFile("basicForm/index.html", {
        root: path.join(__dirname, "../../public"),
    })
}

export const createNewRegister = (req: Request, res: Response) => {
    const data: RegisterInterface = req.body
    const content = Object.entries(data).map(item => item[1])
    let isRepeatId = false
    const dataDirectory = path.join(__dirname, "../data")
    // Check if the file directory is already created and if not then create it
    if (!fs.existsSync(dataDirectory)) {
        fs.mkdirSync(dataDirectory)
    }

    // Check if the id of the new file is not repeated with one of the already existing files
    fs.readdir(dataDirectory, (err, files) => {
        if (err) {
            console.error("Error al leer el directorio:", err)
            return
        }

        isRepeatId = files
            .filter(item => path.extname(item) === ".txt")
            .map(item => Number(item.split("_")[1][0]))
            .some(item => item === data.id)
    })

    // Write the new file and return the file on the response

    fs.writeFile(
        path.join(dataDirectory, `/id_${data.id}.txt`),
        content.join(","),
        err => {
            switch (true) {
                case err !== null:
                    console.error(err)
                    res.status(500).json({ message: "ERROR!", err })
                    break
                case !err && isRepeatId:
                    res.status(400).json({ message: "ID_ALREADY_EXIST" })
                    break
                case !err && !isRepeatId:
                    try {
                        const file = fs.readFileSync(
                            path.join(dataDirectory, `/id_${data.id}.txt`)
                        )

                        res.status(200).json({
                            message: "OK!",
                            data: {
                                file: {
                                    data: file.toString(),
                                    name: `id_${data.id}.txt`,
                                },
                            },
                        })
                    } catch (error) {
                        console.error(err)
                        return res.status(500).send("Error al leer el archivo")
                    }

                    break

                default:
                    res.status(418).json({ message: "IDK!" })
                    break
            }
        }
    )
}
