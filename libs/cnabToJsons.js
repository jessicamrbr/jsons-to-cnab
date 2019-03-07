const _ = require('lodash')

    [
    {
        fieldName: "CODIGODOBANCO",
        positionStart: 1,
        positionEnd: 3,
        positionLength: 3,
        picture: "9",
    }
    ]

class CnabToJsons {
    constructor(fileBase64Encoded) {
        const fileUtf8Encoded = (new Buffer(fileBase64Encoded, 'base64')).toString('utf8')
        this.rows = fileUtf8Encoded.split(/\r?\n/)
    }

    fit_define(definitions) {
        this.definitions = definitions
    }

    convert() {
        jsonRows = []

        for(let row of this.rows) {
            let jsonRow = {}

            for(let definition of this.definitions) {
                let searchs = []
                for (let [key, position] of definition.positions.entries()) {
                    searchs.push(row.indexOf(definition.value[key], position) == position)
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