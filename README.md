[![Build Status](https://travis-ci.org/jessicamrbr/jsons-to-cnab.svg?branch=master)](https://travis-ci.org/jessicamrbr/jsons-to-cnab)
[![Coverage Status](https://coveralls.io/repos/github/jessicamrbr/jsons-to-cnab/badge.svg)](https://coveralls.io/github/jessicamrbr/jsons-to-cnab)

# jsons-to-cnab
Convert JSON map and data to cnab file 

## Installation

```sh
npm install jsons-to-cnab --save
```

## Use

Start the file constructor, providing a name and the size of the internal lines.

``` JavaScript
const JsonsToCnab = require("jsons-to-cnab")

const registryLength = 240
const jsonsToCnab = new JsonsToCnab(registryLength)
...
```

Recalling the structure of CNAB:

| N1      | N2             | N3             | N4      |
| ------- | -------------- | -------------- | ------- |
| File    | Header of File |                |         |
|         | Lots           | Header of Lot  |         |
|         |                | Details        | Detail  |
|         |                |                | Detail  |
|         |                | Footer of Lot  |         |
|         |                | Header of Lot  |         |
|         |                | Details        | Detail  |
|         |                |                | Detail  |
|         |                | Footer of Lot  |         |
|         | Footer of File |                |         |

For each generated file, it is necessary to add only one header and file footer through the set method. We can add one or more of the other elements as head and footer for batch or details.

- We can use config methods more than once. Each time it is used it will configure the element map until the next map configuration.
- The set method rewrites the element properties and should be used at least once. When it is used more than once, it will erase the previous element and write a new one in its place.
- The "add method" includes a new element to the final document. the previous elements are retained instead of rewritten.

Pass the map of the fields that make up the element in the following format.

Each field of ve contains:
- fieldName: Field name for future reference;
- positionStart: initial position in the line, the line starts at character 1;
- positionEnd: final position in the line;
- positionLength: Confirmation of the number of characters occupied, must be equal to the equation: ```(positionEnd - (positionStart - 1))```;
- picture: Indicates the type of the content value and how the spare positions should be filled:
  - X: alphanumeric value, aligned to the left and filled with whites to the right;
  - 9: integer numeric value, right aligned and filled with leading zeros;
  - V0: decimal numeric value, follows the same characteristics of picture 9, but the integer to the right indicates the number of decimal places;
- defaultValue: Default value (in string) used to the field, when is not informed in the data mapping;

ex.:

``` JavaScript
...

const exJsonMapHeaderLot = [
    {
        fieldName: "CODIGODOBANCO", 
        positionStart: 1,
        positionEnd: 3,
        positionLength: 3,
        picture: "9",
        defaultValue: "341", // string!
    },
    {
        fieldName: "CODIGODOLOTE", 
        positionStart: 4,
        positionEnd: 7,
        positionLength: 4,
        picture: "9",
        defaultValue: "0000",
    },
    ...
]

jsonsToCnab.configHeaderLot(exJsonMapHeaderLot)

...
```

The values of the fields will be informed through a JSON, where the attributes will be the names of previously mapped fields.

``` JavaScript
...

const exJsonDataHeaderLot = {
    CODIGODOLOTE: 001
}

jsonsToCnab.addHeaderLot(exJsonDataHeaderLot)

...
```

#### Methods available for manipulating files through JSONs directly.

Configure the file header and define the data applied to the layout:

``` JavaScript
...

jsonsToCnab.configHeaderFile(jsonMap)
jsonsToCnab.setHeaderFile(jsonData)

...
```

Configure a lot header and define the data applied to the layout:

``` JavaScript
...

jsonsToCnab.configHeaderLote(jsonMap)
jsonsToCnab.addHeaderLote(jsonData)

...
```

Configure a row detail and define the data applied to the layout:

``` JavaScript
...

jsonsToCnab.configRow(jsonMap)
jsonsToCnab.addRow(jsonData)

...
```

Configure a lot footer and define the data applied to the layout:

``` JavaScript
...

jsonsToCnab.configFooterLote(jsonMap)
jsonsToCnab.addFooterLote(jsonData)

...
```

Configure a header footer and define the data applied to the layout:

``` JavaScript
...

jsonsToCnab.configFooterFile(jsonMap)
jsonsToCnab.setFooterFile(jsonData)

...
```

Exports the data stored in the instance to a file:

``` JavaScript
...

jsonsToCnab.save()

...
```

#### Methods available for picking up standard layouts

Some of the auxiliary libraries included in this package allow you to get pre-defined layouts of CSV settings tables.


``` JavaScript
...

const bank = "341"
const product = "SISPAG"
const direction = "REMESSA" 
const lotAlias = "PAG-OP-DOC-TED-CC"
        
const {
    configHeaderFile, configHeaderLot, 
    configDetail
    configFooterLot, configFooterFile
} = JsonsToCnab.getFromLayoutsLib(bank, product, direction, lotAlias)

jsonsToCnab.setFooterFile(configFooterFile)

...
```


Você pode salvar seus próprios layouts no formato:

| direction | lotAlias          | rowType       | fieldName     | descripton                   | positionStart  | positionEnd  | positionLength  | picture | defaultValue  |  
| --------- | ----------------- | ------------- | ------------- | ---------------------------- | -------------- | ------------ | --------------- | ------- | ------------- |
| REMESSA   | PAG-OP-DOC-TED-CC | header-file   | CODIGODOBANCO | CÓDIGO DO BCO NA COMPENSAÇÃO | 1              | 3            | 3               | 9       | 341           |
| REMESSA   | PAG-OP-DOC-TED-CC | header-lot    | CODIGODOBANCO | CÓDIGO DO BCO NA COMPENSAÇÃO | 1              | 3            | 3               | 9       | 341           |

## Tips

### CNABS for payments


### CNABS for bank charges

