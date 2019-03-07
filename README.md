[![Build Status](https://travis-ci.org/jessicamrbr/jsons-to-cnab.svg?branch=master)](https://travis-ci.org/jessicamrbr/jsons-to-cnab)
[![Coverage Status](https://coveralls.io/repos/github/jessicamrbr/jsons-to-cnab/badge.svg)](https://coveralls.io/github/jessicamrbr/jsons-to-cnab)

# jsons-to-cnab
Convert JSON map and data to cnab file 

## Installation

```sh
npm install jsons-to-cnab --save
```

## Use

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

#### (Direction: sending/remessa) Methods available for manipulating files through JSONs directly.

Start the file constructor, providing the size of the internal lines.

``` JavaScript
const { JsonsToCnab } = require("jsons-to-cnab")

const registryLength = 240
const jsonsToCnab = new JsonsToCnab(registryLength)

...
```

We can use config methods more than once. Each time it is used it will configure the element map until the next map configuration.

The set method rewrites the element properties and should be used at least once. When it is used more than once, it will erase the previous element and write a new one in its place.

The "add method" includes a new element to the final document. the previous elements are retained instead of rewritten.

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

const exJsonMapSample = [
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

...
```

The values of the fields will be informed through a JSON, where the attributes will be the names of previously mapped fields.

``` JavaScript
...

const exJsonDataSample = {
    CODIGODOLOTE: 001
}

...
```

Configure the file header and define the data applied to the layout:

``` JavaScript
...

jsonsToCnab.configHeaderFile(exJsonMapSample)
jsonsToCnab.setHeaderFile(exJsonDataSample)

...
```

For each generated file, it is necessary to add only one header and file footer through the set method.

We can add one or more of the other elements as head and footer for batch or details.

Configure a lot header and define the data applied to the layout:

``` JavaScript
...

jsonsToCnab.configHeaderLote(exJsonMapSample)
jsonsToCnab.addHeaderLote(exJsonDataSample)

...
```

Configure a row detail and define the data applied to the layout:

``` JavaScript
...

jsonsToCnab.configRow(exJsonMapSample)
jsonsToCnab.addRow(exJsonDataSample)

...
```

Configure a lot footer and define the data applied to the layout:

``` JavaScript
...

jsonsToCnab.configFooterLote(exJsonMapSample)
jsonsToCnab.addFooterLote(exJsonDataSample)

...
```

Configure a header footer and define the data applied to the layout:

``` JavaScript
...

jsonsToCnab.configFooterFile(exJsonMapSample)
jsonsToCnab.setFooterFile(exJsonDataSample)

...
```

Exports the data stored in the instance to a file:

``` JavaScript
...

jsonsToCnab.save()

...
```

#### (Direction: return/retorno) Methods available for manipulating files through JSONs directly.

Start the file reader, providing the size of the internal lines.

``` JavaScript
const { CnabToJsons } = require("jsons-to-cnab")

const base64FromFile = getFile() // this method is not included in the package, it returns a file encoded in base64
const cnabToJsons = new CnabToJsons(base64FromFile)

...
```

We need to train the reader so that it identifies which layout to apply to each line.

``` JavaScript
...

const definitions = [
    {
        "position": [14],
        "value": ["A"],
        "map": exJsonMapSample
    }
]

cnabToJsons.fit_define(definitions)

...
```

Exports the data from file to instance:

``` JavaScript
...

const jsonData = cnabToJsons.convert()

...
```

#### Methods available for picking up standard layouts

Some of the auxiliary libraries included in this package allow you to get pre-defined layouts of CSV settings tables.


``` JavaScript
...

const product = "SISPAG"
const registerAlias = "HED-OP-DOC-TED-CC"
        
const jsonMap = JsonsToCnab.getFromLayoutsLib(product, registerAlias)

jsonsToCnab.setFooterFile(jsonMap)

...
```


You can save your own layouts in the format:

| registerAlias | fieldName     | descripton                   | positionStart  | positionEnd  | positionLength  | picture | defaultValue  |  
| ------------- | ------------- | ---------------------------- | -------------- | ------------ | --------------- | ------- | ------------- |
| HED-FIL       | CODIGODOBANCO | CÓDIGO DO BCO NA COMPENSAÇÃO | 1              | 3            | 3               | 9       | 341           |
| HED-FIL       | CODIGODOLOTE  | LOTE DE SERVIÇO              | 4              | 7            | 4               | 9       |               |

#### Others help methods

- ```jsonsToCnab.counterLots()```: Count the current number of registered lots;
- ```jsonsToCnab.counterRegistersInFile()```: Count the total lines of the file;
- ```jsonsToCnab.counterRegistersInCurrentLot()```: Count total lines in lot
- ```jsonsToCnab.counterDetailsInCurrentLot()```: Counts the total of computed* details

\* By adding a row you can tell whether or not it should be computed. Some instructions specify that special records should not be computed with a new sequential number.

## Tips

### CNABs for payments


### CNABs for bank charges

