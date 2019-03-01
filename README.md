[![Build Status](https://travis-ci.org/jessicamrbr/jsons-to-cnab.svg?branch=master)](https://travis-ci.org/jessicamrbr/jsons-to-cnab)
[![Coverage Status](https://coveralls.io/repos/github/jessicamrbr/jsons-to-cnab/badge.svg?branch=master)](https://coveralls.io/github/jessicamrbr/jsons-to-cnab?branch=master)

# jsons-to-cnab
Convert JSON map and data to cnab file 

## Installation

```sh
npm install sons-to-cnab --save
```

## Use

Start the file constructor, providing a name and the size of the internal lines.

``` JavaScript
const JsonToCnab = require("json-to-cnab")

const fileName = "REM001.txt"
const registryLength = 240

const jsonToCnab = new JsonToCnab(fileName, registryLength)
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

jsonToCnab.configHeaderLot(exJsonMapHeaderLot)

...
```

The values of the fields will be informed through a JSON, where the attributes will be the names of previously mapped fields.

``` JavaScript
...

const exJsonDataHeaderLot = {
    CODIGODOLOTE: 001
}

jsonToCnab.addHeaderLot(exJsonDataHeaderLot)

...
```

#### Methods available for manipulating files through JSONs directly.

Configure the file header and define the data applied to the layout:

``` JavaScript
...

jsonToCnab.configHeaderFile(jsonMap)
jsonToCnab.setHeaderFile(jsonData)

...
```

Configure a lot header and define the data applied to the layout:

``` JavaScript
...

jsonToCnab.configHeaderLote(jsonMap)
jsonToCnab.addHeaderLote(jsonData)

...
```

Configure a row detail and define the data applied to the layout:

``` JavaScript
...

jsonToCnab.configRow(jsonMap)
jsonToCnab.addRow(jsonData)

...
```

Configure a lot footer and define the data applied to the layout:

``` JavaScript
...

jsonToCnab.configFooterLote(jsonMap)
jsonToCnab.addFooterLote(jsonData)

...
```

Configure a header footer and define the data applied to the layout:

``` JavaScript
...

jsonToCnab.configFooterFile(jsonMap)
jsonToCnab.setFooterFile(jsonData)

...
```

Exports the data stored in the instance to a file:

``` JavaScript
...

jsonToCnab.save()

...
```

#### Methods available for picking up standard layouts

Some of the auxiliary libraries included in this package allow you to get pre-defined layouts of CSV settings tables.


``` JavaScript
...

const bank = "341"
const product = "SISPAG"
const direction = "REMESSA" 
const lot_name = "PAG-OP-DOC-TED-CC"
        
const {
    configHeaderFile, configHeaderLot, 
    configDetail
    configFooterLot, configFooterFile
} = JsonToCnab.getFromLayoutsLib(bank, product, direction, lot_name)

jsonToCnab.setFooterFile(configFooterFile)

...
```


Você pode salvar seus próprios layouts no formato:

| bank | product | direction | lot               | row_type      | field_name    | descripton                   | position_start | position_end | position_length | picture | default_value |  
| ---- | ------- | --------- | ----------------- | ------------- | ------------- | ---------------------------- | -------------- | ------------ | --------------- | ------- | ------------- |
| Itaú | SISPAG  | REMESSA   | PAG-OP-DOC-TED-CC | header-file   | CODIGODOBANCO | CÓDIGO DO BCO NA COMPENSAÇÃO | 1              | 3            | 3               | 9       | 341           |
| Itaú | SISPAG  | REMESSA   | PAG-OP-DOC-TED-CC | header-lot    | CODIGODOBANCO | CÓDIGO DO BCO NA COMPENSAÇÃO | 1              | 3            | 3               | 9       | 341           |

## Tips

### CNABS for payments


### CNABS for bank charges

