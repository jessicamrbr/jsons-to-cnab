const chai = require('chai')
const expect = chai.expect
const should = chai.should()

describe('Class jsonsToCnab', function() {
    describe('Method constructor', function() {
        it('should return a instânce of class', function() {
            const jsonsToCnab = require("../../index")

            const registryLength = 240
            const jsonToCnab = new jsonsToCnab(registryLength)

            expect(jsonToCnab).to.be.an.instanceof(jsonsToCnab)
        })
    })

    describe('Method getFromLayoutsLib', function() {
        it('should return a json object', async function() {
            const jsonsToCnab = require("../../index")

            const product = "341SISPAG"
            const direction = "REMESSA"
            const lotAlias = "PAG-OP-DOC-TED-CC"
            const layout = await jsonsToCnab.getFromLayoutsLib(product, direction, lotAlias)

            expect(layout).to.be.an.instanceof(Object)
        })
    })
})