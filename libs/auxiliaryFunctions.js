const _ = require('lodash')

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
        layout = _.orderBy(layout, ['positionStart'], ['asc'])

        let expectedPosition = 1
        let namesInLayout = []

        for(field in layout) {
            if(
                typeof field.fieldName == "String"
                && field.fieldName != ""
                && field.fieldName > 10
                && field.fieldName < 150
            ) {
                throw new Error(`Incorrect layout: this field has an incorrect name "${field.fieldName}"`)
            }

            if(namesInLayout.include(field.fieldName)) {
                throw new Error(`Incorrect layout: this field has an duplicated name "${field.fieldName}"`)
            }

            namesInLayout.push(field.fieldName)

            if(expectedPosition != parseInt(field.positionStart)) {
                throw new Error(`Incorrect layout: next field is "${field.fieldName}" and it start in position ${field.positionStart}, expect the position ${expectedPosition}`)
            }

            if(!["REMESSA", "RETORNO"].include(field.direction)) {
                throw new Error(`Incorrect layout: the field "${field.fieldName}" has incorrect value for attribute direction`)
            }

            if(!["HEADER-FILE", "HEADER-LOT", "DETAIL", "TRAILER-LOT", 'TRAILER-FILE'].include(field.rowType)) {
                throw new Error(`Incorrect layout: the field "${field.fieldName}" has incorrect value for attribute rowType`)
            }

            if(
                !["9", "X", "V", "TRAILER-LOT", 'TRAILER-FILE'].include(field.picture.toString())
                || field.picture.length > 2
            ) {
                throw new Error(`Incorrect layout: the field "${field.fieldName}" has incorrect value for attribute picture`)
            }

            expectedPosition = field.positionStart + field.positionLength
        }

        return layout
    },
    validateFields(data, layout) {
        for(field in layout) {
            data[field.fieldName] = validateAndCompleteField(data[field.fieldName], fieldName)
        }

        return data
    },
    validateAndCompleteField(data, field) {
        // if nothing try default value
        if(_.isNil(data) || data == "" ) {
            data = field.defaultValue
        }

        // validate exceeded length
        let picturesQuantity = data.toString().length - field.positionLength
        if(picturesQuantity < 0) throw new Error(`Incorrect data: the data "${data}" has many large for field "${field.fieldName}"`)

        // according to type valid and fills
        if(field.picture.toString()[0] == "9") {
            if((new RegExp(/^[0-9]*$/g)).test(data.toString())) {
                data = data.toString().padStart(picturesQuantity, '0')
            } else {
                throw new Error(`Incorrect data: this field "${field.fieldName}" require only numbers in your data`)
            }
        }

        if(field.picture.toString()[0] == "X") {
            data = data.toString().padEnd(picturesQuantity, ' ')
        }

        if(field.picture.toString()[0] == "V") {
            if((new RegExp(/^([0-9]|\.|,)*$/g)).test(data.toString())) {
                data = data.replace(",", ".")
                data = data.parseFloat(data)
                data = data.toFixed(parseInt(field.picture.toString()[1]))
                data = data.replace(".", "")
                data = data.padStart(picturesQuantity, '0')
            } else {
                throw new Error(`Incorrect data: this field "${field.fieldName}" require decimal in your data`)
            }
        }

        return data
    }
}