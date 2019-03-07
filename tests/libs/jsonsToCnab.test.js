const chai = require('chai')
const expect = chai.expect
const should = chai.should()

describe('Class JsonsToCnab', function() {
    const { JsonsToCnab } = require("../../index")

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
            layout = await JsonsToCnab.getFromLayoutsLib("341SISPAG", "HED-FIL")
            expect(layout).to.be.an.instanceof(Object)
        })
    })

    describe('Method configHeaderFile', function() {
        it('should insert a json object into proprety', function() {
            jsonToCnab.configHeaderFile(layout)
            expect(jsonToCnab.currentHeaderFileLayout).to.be.an.instanceof(Object)
            expect(jsonToCnab.currentHeaderFileLayout.length).to.not.equal(0)
        })
    })

    describe('Method setHeaderFile', function() {
        it('should return a json object', async function() {

        })
    })

    describe('Method configHeaderLot', function() {
        it('should return a json object', async function() {

        })
    })

    describe('Method addHeaderLote', function() {
        it('should return a json object', async function() {

        })
    })

    describe('Method counterLots', function() {
        it('should return a json object', async function() {

        })
    })

    describe('Method configRow', function() {
        it('should return a json object', async function() {

        })
    })

    describe('Method addRow', function() {
        it('should return a json object', async function() {

        })
    })

    describe('Method counterRegistersInFile', function() {
        it('should return a json object', async function() {

        })
    })

    describe('Method counterRegistersInCurrentLot', function() {
        it('should return a json object', async function() {

        })
    })

    describe('Method counterDetailsInCurrentLot', function() {
        it('should return a json object', async function() {

        })
    })

    describe('Method configFooterLot', function() {
        it('should return a json object', async function() {

        })
    })

    describe('Method addFooterLote', function() {
        it('should return a json object', async function() {

        })
    })

    describe('Method configFooterFile', function() {
        it('should return a json object', async function() {

        })
    })

    describe('Method setFooterFile', function() {
        it('should return a json object', async function() {

        })
    })

    describe('Method save', function() {
        it('should return a json object', async function() {

        })
    })
})