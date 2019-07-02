const csv = require('csvtojson')
const _ = require('lodash')

const { validateLayoutDirectory } = require('./auxiliaryFunctions')

class CnabFromCsv {
    static async getFromLayoutsLib(product, registerAlias, layoutDirectory) {
        layoutDirectory = validateLayoutDirectory(layoutDirectory)

        let layout = await csv({
            "trim": true,
            "ignoreEmpty": true
        }).fromFile(`${layoutDirectory}/${product}.csv`)

        layout = _.filter(layout, (item) => {
            return (item.registerAlias == registerAlias            )
        })

        layout = _.map(layout, (field) => {
            return _.omit(field, ['descripton'])
        })

        return layout
    }
}

module.exports = CnabFromCsv
