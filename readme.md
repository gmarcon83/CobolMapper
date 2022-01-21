# COBOL Mapper

Translate a Cobol data block to a JS object. Full TS support.

Initial release, for now only supports basic PIC types using "X(6)", "9(5)" etc...

## Usage

Install in a particular project:

```
npm i XX_TODO_XX
```

Import with:

```
import { CobolMapper } from "CobolMapper";
```

Describe the Cobol data structure with:

```
const dataMap = [
  { name: "myProp1", pic: "X(8)" },
  { name: "myProp2", pic: "X(6)" },
  { name: "myProp3", pic: "9(5)" },
  { name: "myProp4", pic: "9(10)" },
];
```

Create an object with:

```
const cm = New CobolMapper(dataMap)
```

Set all values using a data block:

```
cm.setValue("A23     BX    001230012345678")
```

Set individual values with:

```
cm.myProp1 = "Some str";
cm.myProp2 = "EX";
cm.myProp3 = 234;
cm.myProp4 = 3456786;
```

Get all values with:

```
cm.getValue() // Return all values as a single string.
```

Get individual values with:

```
cm.myProp1 // Returns the value of myProp1
```

Get all properties names with:

```
cm.getProperties() // Return an array of all properties
```
