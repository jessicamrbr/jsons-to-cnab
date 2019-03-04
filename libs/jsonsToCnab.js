const csv = require('csvtojson')
const _ = require('lodash')
const flatten = require('array-flatten')

const {
    validateRegistryLength, validateLayoutDirectory,
    validateLayout, validateFields
} = require('./auxiliaryFunctions')

class jsonsToCnab {
    constructor(registryLength=240) {
        this.registryLength = validateRegistryLength(registryLength)

        this.headerFileContent = ""
        this.footerFileContent = ""
        this.lots = []
        this.lotNumber = 0
        this.detailNumberInCurrentLot = 0
    }

    configHeaderFile(layout) {
        layout = validateLayout(layout)
        if(this.headerFileContent != "") throw new Error("The file header already added and can not be changed")
        this.currentHeaderFileLayout = layout
    }

    setHeaderFile(data) {
        data = validateFields(data, this.currentHeaderFileLayout)
        this.headerFileContent = Object.values(data)
        this.headerFileContent.push("\n")
    }

    configHeaderLot(layout) {
        layout = validateLayout(layout)
        this.currentHeaderLot = layout
    }

    addHeaderLote(data) {
        data = validateFields(data, this.currentHeaderLot)
        this.lots.push([])
        this.lots[this.lots.length-1][0] = Object.values(data)
        this.lots[this.lots.length-1][0].push("\n")
        this.lots[this.lots.length-1][1] = []
        this.lots[this.lots.length-1][2] = []
        this.lotNumber += 1
    }

    counterLots() {
        return this.lotNumber
    }

    configRow(layout) {
        layout = validateLayout(layout)
        this.currentRow = layout
    }

    addRow(data, countRow=true) {
        data = validateFields(data, this.currentRow)
        data = Object.values(data)
        data.push("\n")
        this.lots[this.lots.length-1][1].push(data)
        this.detailNumberInCurrentLot += (countRow) ? 1 : 0
    }

    counterRegistersInFile() {
        let counterLines = 0

        counterLines += (this.headerFileContent.length != 0) ? 1 : 0

        for(let lot of this.lots) {
            counterLines += (lot[0].length != 0) ? 1 : 0
            for(let rowInLot of lot[1]) {
                counterLines += 1
            }
            counterLines += (lot[2].length != 0) ? 1 : 0
        }

        counterLines += (this.footerFileContent.length != 0) ? 1 : 0

        return counterLines
    }

    counterRegistersInCurrentLot() {
        let counterLines = 0

        counterLines += (this.lots[this.lots.length-1][0].length != 0) ? 1 : 0
        for(let rowInLot of this.lots[this.lots.length-1][1]) {
            counterLines += 1
        }
        counterLines += (this.lots[this.lots.length-1][2].length != 0) ? 1 : 0

        return counterLines
    }

    counterDetailsInCurrentLot() {
        return this.detailNumberInCurrentLot
    }

    configFooterLot(layout) {
        layout = validateLayout(layout)
        this.currentFooterLot = layout
    }

    addFooterLote(data) {
        data = validateFields(data, this.currentFooterLot)
        this.lots[this.lots.length-1][2] = Object.values(data)
        this.lots[this.lots.length-1][2].push("\n")
    }

    configFooterFile(layout) {
        layout = validateLayout(layout)
        if(this.footerFileContent != "") throw new Error("The file footer already added and can not be changed")
        this.currentFooterFileLayout = layout
    }

    setFooterFile(data) {
        data = validateFields(data, this.currentFooterFileLayout)
        this.footerFileContent = Object.values(data)
    }

    save() {
        if (this.countLotHeader < 1) throw new Error("The file needs at least one lot")
        if (this.countLotHeader != this.countLotFooter) throw new Error("All lots headers need their respective footer")

        let fileContent  = ""
        fileContent += this.headerFileContent.join("")
        fileContent += flatten(this.lots).join("")
        fileContent += this.footerFileContent.join("")

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

        layout = _.groupBy(layout, 'rowType')
        _.mapKeys(layout, function(group, groupKey) {
            layout[groupKey] = _.map(group, (item) => { return _.omit(item, ['direction', 'rowType', 'descripton']) })
        })

        return layout
    }
}

module.exports = jsonsToCnab