const {
    validateRegistryLength, validateStandardLayoutsDir,
    validateLayout, validateFields
} = require('auxiliaryFunctions')

const csv=require('csvtojson')

class jsonsToCnab {
    constructor(registryLength=240, standardLayoutsDir="") {
        this.registryLength = validateRegistryLength(registryLength)
        this.standardLayoutsDir = validateStandardLayoutsDir(standardLayoutsDir)


        this.headerFileContent = ""
        this.footerFileContent = ""
    }

    configHeaderFile(layout) {
        validateLayout(layout)
        if(this.headerFileContent != "") throw new Error("The file header already added and can not be changed")
        this.currentHeaderFileLayout = layout
    }

    setHeaderFile(data) {
        validateFields(data, this.currentHeaderFileLayout)
        this.headerFileContent = data
    }

    configHeaderLot(layout) {
        validateLayout(layout)
        this.currentHeaderLot = layout
    }

    addHeaderLote(data) {
        this.lots[] =
    }

    configRow(layout) {
        validateLayout(layout)
        this.currentRow = layout
    }

    addRow(data) {

    }

    configFooterLot(layout) {
        validateLayout(layout)
        this.currentHeaderLot = layout
    }

    addFooterLote(data) {
        this.countLotFooter++
    }

    configFooterFile(layout) {
        validateLayout(layout)
        if(this.headerFileContent != "") throw new Error("The file footer already added and can not be changed")
        this.currentHeaderLot = layout
    }

    setFooterFile(data) {
        this.footerFileContent
    }

    save() {
        // Validate conditions data
        if (this.countLotHeader < 1) throw new Error("The file needs at least one lot")
        if (this.countLotHeader != this.countLotFooter) throw new Error("All lots headers need their respective footer")

        fileContent  = ""
        fileContent += this.headerFileContent
        fileContent += this.footerFileContent

        return Buffer.from(fileContent, 'utf8')
    }

    static getFromLayoutsLib(bank, product, direction, lot_name) {
        this.standardLayoutsDir
    }
}

module.exports = jsonsToCnab