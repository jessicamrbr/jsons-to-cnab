const chai = require('chai')
const expect = chai.expect
const should = chai.should()

describe('Class JsonsToCnab', function() {
    const { JsonsToCnab, CnabFromCsv } = require("../../index")

    const registryLength = 240
    let jsonToCnab = {}
    let layout = {}

    describe('Method constructor', function() {
        it('should return a instânce of class', function() {
            jsonToCnab = new JsonsToCnab(registryLength)
            expect(jsonToCnab).to.be.an.instanceof(JsonsToCnab)
        })
    })

    describe('Method getFromLayoutsLib', function() {
        it('should return a json object from csv file', async function() {
            layout = await CnabFromCsv.getFromLayoutsLib("341SISPAG", "HED-FIL")
            expect(layout).to.be.an.instanceof(Object)
        })
    })

    describe('Method configHeaderFile', function() {
        it('should insert a json object into proprety', function() {
            jsonToCnab.configHeaderFile(layout)
            expect(jsonToCnab.currentHeaderFile).to.be.an.instanceof(Object)
            expect(jsonToCnab.currentHeaderFile.length).to.not.equal(0)
        })
    })

    describe('Method setHeaderFile', function() {
        it('should return a json object', async function() {
            jsonToCnab.setHeaderFile({"NOMEDAEMPRESA": "EMPTEST"})
            expect(jsonToCnab.headerFileContent).to.be.an("array")
            expect(jsonToCnab.headerFileContent.length).to.not.equal(0)
        })
    })

    describe('Method configHeaderLot', function() {
        it('should return a json object', async function() {
            layout = await CnabFromCsv.getFromLayoutsLib("341SISPAG", "HED-OP-DOC-TED-CC")
            jsonToCnab.configHeaderLot(layout)
            expect(jsonToCnab.currentHeaderLot).to.be.an.instanceof(Object)
            expect(jsonToCnab.currentHeaderLot.length).to.not.equal(0)
        })
    })

    describe('Method addHeaderLote', function() {
        it('should return a json object', async function() {
            jsonToCnab.addHeaderLote({"NOMEDAEMPRESA": "EMPTEST"})
            expect(jsonToCnab.lots).to.be.an("array")
            expect(jsonToCnab.lots.length).to.not.equal(0)
        })
    })

    describe('Method counterLots', function() {
        it('should return a json object', async function() {
            const cnt = jsonToCnab.counterLots()
            expect(cnt).to.equal(1)
        })
    })

    describe('Method configRow', function() {
        it('should return a json object', async function() {
            layout = await CnabFromCsv.getFromLayoutsLib("341SISPAG", "DET-OP-DOC-TED-CC-SEG-A")
            jsonToCnab.configRow(layout)
            expect(jsonToCnab.currentRow).to.be.an.instanceof(Object)
            expect(jsonToCnab.currentRow.length).to.not.equal(0)
        })
    })

    describe('Method addRow', function() {
        it('should return a json object', async function() {
            jsonToCnab.addRow({"VALORDOPAGTO": "10,2"})
            expect(jsonToCnab.lots).to.be.an("array")
            expect(jsonToCnab.lots.length).to.not.equal(0)
        })
    })

    describe('Method counterRegistersInFile', function() {
        it('should return a json object', async function() {
            const cnt = jsonToCnab.counterRegistersInFile()
            expect(cnt).to.equal(3)
        })
    })

    describe('Method counterRegistersInCurrentLot', function() {
        it('should return a json object', async function() {
            const cnt = jsonToCnab.counterRegistersInCurrentLot()
            expect(cnt).to.equal(2)
        })
    })

    describe('Method counterDetailsInCurrentLot', function() {
        it('should return a json object', async function() {
            const cnt = jsonToCnab.counterDetailsInCurrentLot()
            expect(cnt).to.equal(1)
        })
    })

    describe('Method configFooterLot', function() {
        it('should return a json object', async function() {
            layout = await CnabFromCsv.getFromLayoutsLib("341SISPAG", "TRA-OP-DOC-TED-CC")
            jsonToCnab.configFooterLot(layout)
            expect(jsonToCnab.currentFooterLot).to.be.an.instanceof(Object)
            expect(jsonToCnab.currentFooterLot.length).to.not.equal(0)
        })
    })

    describe('Method addFooterLote', function() {
        it('should return a json object', async function() {
            jsonToCnab.addFooterLote({"TOTALQTDEREGISTROS": "1"})
            expect(jsonToCnab.lots).to.be.an("array")
            expect(jsonToCnab.lots.length).to.not.equal(0)
        })
    })

    describe('Method configFooterFile', function() {
        it('should return a json object', async function() {
            layout = await CnabFromCsv.getFromLayoutsLib("341SISPAG", "TRA-FIL")
            jsonToCnab.configFooterFile(layout)
            expect(jsonToCnab.currentFooterFile).to.be.an.instanceof(Object)
            expect(jsonToCnab.currentFooterFile.length).to.not.equal(0)
        })
    })

    describe('Method setFooterFile', function() {
        it('should return a json object', async function() {
            jsonToCnab.setFooterFile({"TOTALQTDEDELOTES": "1"})
            expect(jsonToCnab.footerFileContent).to.be.an("array")
            expect(jsonToCnab.footerFileContent.length).to.not.equal(0)
        })
    })

    describe('Method save', function() {
        it('should return a json object', async function() {
            let bf = jsonToCnab.save()
            let file = bf.toString('utf8')
            expect(file).to.be.an("string")
        })
    })
})