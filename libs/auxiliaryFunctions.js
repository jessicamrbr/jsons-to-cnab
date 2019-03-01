module.exports = {
    validateStandardLayoutsDir(standardLayoutsDir) {
        return (typeof fileName == "String" && fileName != "")
            ? standardLayoutsDir
            : "/layouts"
    },
    validateRegistryLength(registryLength) {
        return (typeof registryLength == "number" && (registryLength == 240 || registryLength == 400))
            ? registryLength
            : 240
    },
    validateLayout() {

    },
    validateFields() {

    }
}