const formLibrary = document.forms.item("formLibrary")

const validateField = idInput => {
    const inputElement = document.getElementById(idInput)
    inputElement.setAttribute(
        "aria-invalid",
        String(inputElement.value) === "" ? "true" : "false"
    )
}

formLibrary?.addEventListener("submit", async ev => {
    ev.preventDefault()
    try {
        const body = Object.fromEntries(
            Object.entries(formLibrary.elements)
                .filter(item => Number.isNaN(Number(item[0])))
                .map(item => [
                    item[0],
                    Number.isNaN(Number(item[1].value))
                        ? item[1].value
                        : Number(item[1].value),
                ])
        )
        const response = await (
            await fetch("/api/user", {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            })
        ).json()

        switch (true) {
            case response.message == "OK!": {
                const currentReader = new FileReader()

                currentReader.onload = evt => {
                    const contenido = evt.target.result
                    const blob = new Blob([contenido], { type: "octet/stream" })
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement("a")
                    link.href = url
                    link.download = response.data.file.name
                    link.click()
                    window.URL.revokeObjectURL(url)
                }
                currentReader.readAsArrayBuffer(
                    new Blob([response.data.file.data])
                )
                alert("REGISTRO CREADO EXITOSAMENTE! EMPEZANDO DESCARGA")
                break
            }

            case response.message == "ID_ALREADY_EXIST":
                alert("El id ya existe por favor ingresa otro!")
                break

            default:
                alert("ES HORA DE ENTRAR EN PANICO!")
                break
        }
    } catch (error) {
        console.error(error)
    }
})
