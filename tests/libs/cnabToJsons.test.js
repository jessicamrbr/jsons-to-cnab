const chai = require('chai')
const expect = chai.expect
const should = chai.should()

const fs = require('fs');
const path = require('path');

describe('Class CnabToJsons', function() {
    const { CnabToJsons, CnabFromCsv } = require("../../index")
    const base64FromFile = fs
        .readFileSync(path.resolve(__dirname, 'sispag.ret'))
        .toString('base64')
    let cnabToJsons = {}

    describe('Method constructor', function() {
        it('should return a instânce of class', function() {
            cnabToJsons = new CnabToJsons(base64FromFile)
            expect(cnabToJsons).to.be.an.instanceof(CnabToJsons)
        })
    })

    describe('Method fit', function() {
        it('should return a json object', async function() {
            layout = await CnabFromCsv.getFromLayoutsLib("341SISPAG", "HED-FIL")
            cnabToJsons.fit([
                {
                    "positions": [4, 8],
                    "values": ["0000", "0"],
                    "map": layout
                }
            ])
            expect(cnabToJsons.definitions).to.be.an.instanceof(Object)
        })
    })

    describe('Method convert', function() {
        it('should return a json object', async function() {
            const jsonFromCnab = cnabToJsons.convert()
            expect(jsonFromCnab).to.be.an.instanceof(Object)
        })
    })
})