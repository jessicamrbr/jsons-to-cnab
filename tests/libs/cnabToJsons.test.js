const chai = require('chai')
const expect = chai.expect
const should = chai.should()

describe('Class CnabToJsons', function() {
    const { CnabToJsons } = require("../../index")
    const base64FromFile = ""

    describe('Method constructor', function() {
        it('should return a instânce of class', function() {
            const cnabToJsons = new CnabToJsons(base64FromFile)

            expect(cnabToJsons).to.be.an.instanceof(CnabToJsons)
        })
    })

    describe('Method ', function() {
        it('should return a json object', async function() {

        })
    })
})