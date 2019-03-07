const _ = require('lodash')

const {
    validateLayout
} = require('./auxiliaryFunctions')

class CnabToJsons {
    constructor(fileBase64Encoded) {
        const fileUtf8Encoded = (new Buffer(fileBase64Encoded, 'base64')).toString('utf8')
        this.rows = fileUtf8Encoded.split(/\r?\n/)
    }

    fit(definitions) {
        for(let [key, definition] of definitions.entries()) {
            validateDefinition(definition.positions, definition.values)
            definitions[key].map = validateLayout(definition.map)
        }

        this.definitions = definitions
    }

    convert() {
        let jsonRows = []

        for(let row of this.rows) {
            let jsonRow = {}

            for(let definition of this.definitions) {
                let searchs = []
                for (let [key, position] of definition.positions.entries()) {
                    searchs.push(row.indexOf(definition.values[key], position-1) == position-1)
                }

                if(!searchs.includes(false)) {
                    for(let field of definition.map) {
                        jsonRow[field.fieldName] = row.slice(
                            (field.positionStart-1),
                            ((field.positionStart-1)+field.positionLength)
                        )
                    }
                }
            }

            jsonRows.push(jsonRow)
        }

        return jsonRows
    }
}

module.exports = CnabToJsons