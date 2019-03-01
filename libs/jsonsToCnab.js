const csv=require('csvtojson')
const _=require('lodash')

const {
    validateRegistryLength, validateLayoutDirectory,
    validateLayout, validateFields
} = require('./auxiliaryFunctions')

class jsonsToCnab {
    constructor(registryLength=240, standardLayoutsDir="") {
        this.registryLength = validateRegistryLength(registryLength)

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
        this.lots[1] = ""
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

    static async getFromLayoutsLib(product, direction="REMESSA", lotAlias, layoutDirectory) {
        layoutDirectory = validateLayoutDirectory(layoutDirectory)

        let layout = await csv({
            "trim": true,
            "ignoreEmpty": true
        }).fromFile(`${layoutDirectory}${product}.csv`)

        layout = _.filter(layout, (item) => { return (
            item.direction == direction
            && (
                item.lotAlias == lotAlias
                || _.isNil(item.lotAlias)
            )
        )})

        return layout
    }
}

module.exports = jsonsToCnab