const _ = require('lodash')

const validateAndCompleteField = (data, field) => {
    // if nothing try default value
    if(_.isNil(data) || data == "" ) {
        data = field.defaultValue || ""
    }

    // validate exceeded length
    if((field.positionLength - data.toString().length) < 0) {
        throw new Error(`Incorrect data: the data "${data}" has many large for field "${field.fieldName}"`)
    }

    // according to type valid and fills
    if(field.picture.toString()[0] == "9") {
        if((new RegExp(/^[0-9]*$/g)).test(data.toString())) {
            data = _.deburr(data).toUpperCase().replace(/[^\w\d\s]/g, '')
            data = data.toString().padStart(field.positionLength, '0')
        } else {
            throw new Error(`Incorrect data: this field "${field.fieldName}" require only numbers in your data`)
        }
    }

    if(field.picture.toString()[0] == "X") {

        data = data.toString().padEnd(field.positionLength, ' ')
    }

    if(field.picture.toString()[0] == "V") {
        if((new RegExp(/^([0-9]|\.|,)*$/g)).test(data.toString())) {
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
            : "./layouts/"
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
    validateFields(data, layout) {
        let processedData = {}

        for(let field of layout) {
            processedData[field.fieldName] = validateAndCompleteField(data[field.fieldName], field)
        }

        return processedData
    }
}