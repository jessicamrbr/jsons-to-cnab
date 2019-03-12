const _ = require('lodash')
const path = require('path');

const validateAndCompleteField = (data, field) => {
    // if nothing try default value
    if(_.isNil(data) || data == "" ) {
        data = field.defaultValue || ""
    }

    // validate exceeded length
    data = data.toString().slice(0, field.positionLength)

    // according to type valid and fills
    if(field.picture.toString()[0] == "9") {
        if((new RegExp(/^[0-9]*$/g)).test(data)) {
            data = data.padStart(field.positionLength, '0')
        } else {
            throw new Error(`Incorrect data: this field "${field.fieldName}" require only numbers in your data`)
        }
    }

    if(field.picture.toString()[0] == "X") {
        data = _.deburr(data).toUpperCase().replace(/[^\w\d\s]/g, '')
        data = data.padEnd(field.positionLength, ' ')
    }

    if(field.picture.toString()[0] == "V") {
        if((new RegExp(/^([0-9]|\.|,)*$/g)).test(data)) {
            data = data.replace(",", ".")
            data = (data == "") ? 0 : data
            data = parseFloat(data)
            data = data.toFixed(parseInt(field.picture.toString()[1]))
            data = data.replace(".", "")
            data = data.padStart(field.positionLength, '0')
        } else {
            throw new Error(`Incorrect data: this field "${field.fieldName}" require decimal in your data`)
        }
    }

    return data
}

module.exports = {
    validateLayoutDirectory(layoutDirectory) {
        return (typeof fileName == "String" && fileName != "")
            ? layoutDirectory
            : path.resolve(__dirname, "../layouts/") + "/"
    },
    validateRegistryLength(registryLength) {
        return (typeof registryLength == "number" && (registryLength == 240 || registryLength == 400))
            ? registryLength
            : 240
    },
    validateLayout(layout) {
        layout = _.map(layout, (item) => {
            item.positionStart = parseInt(item.positionStart)
            item.positionEnd = parseInt(item.positionEnd)
            item.positionLength = parseInt(item.positionLength)
            return item
        })

        layout = _.orderBy(layout, ['positionStart'], ['asc'])

        let expectedPosition = 1
        let namesInLayout = []

        for(let field of layout) {
            if(
                typeof field.fieldName == "String"
                && field.fieldName != ""
                && field.fieldName > 10
                && field.fieldName < 150
            ) {
                throw new Error(`Incorrect layout: this field has an incorrect name "${field.fieldName}"`)
            }

            if(namesInLayout.includes(field.fieldName)) {
                throw new Error(`Incorrect layout: this field has an duplicated name "${field.fieldName}"`)
            }

            namesInLayout.push(field.fieldName)

            if(expectedPosition != parseInt(field.positionStart)) {
                throw new Error(`Incorrect layout: next field is "${field.fieldName}" and it start in position ${field.positionStart}, expect the position ${expectedPosition}`)
            }

            if(
                !["9", "X", "V"].includes(field.picture.toString()[0])
                || field.picture.length > 2
            ) {
                throw new Error(`Incorrect layout: the field "${field.fieldName}" has incorrect value for attribute picture`)
            }

            expectedPosition = field.positionStart + field.positionLength
        }

        return layout
    },
    validateDefinition(positions, values){
        if(!Array.isArray(positions) || positions.length < 1) throw new Error(`Incorrect fit definition: positions must be an array with at least one element`)
        if(!Array.isArray(values) || values.length < 1) throw new Error(`Incorrect fit definition: values must be an array with at least one element`)
        if(values.length != positions.length) throw new Error(`Incorrect fit definition: positions and values must have the same amount of elements`)
    },
    validateFields(data, layout) {
        let processedData = {}

        for(let field of layout) {
            processedData[field.fieldName] = validateAndCompleteField(data[field.fieldName], field)
        }

        return processedData
    },
    parseValue(data, picture) {
        // according to type parse value
        if(picture.toString()[0] == "9") { data = parseInt(data) }

        if(picture.toString()[0] == "X") { data = data.trim() }

        if(picture.toString()[0] == "V") {
            let positionDecimal = parseInt(picture.toString()[1]) * -1
            data = parseFloat(data.slice(0, positionDecimal) + "." + data.slice(positionDecimal))
        }

        return data
    }
}