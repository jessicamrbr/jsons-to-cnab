module.exports = {
    validateLayoutDirectory(layoutDirectory) {
        return (typeof fileName == "String" && fileName != "")
            ? layoutDirectory
            : "./layouts/"
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