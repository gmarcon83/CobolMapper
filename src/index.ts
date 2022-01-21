import { Pic, Prop, PropObj } from "./lib/types";

export class CobolMapper {
  [key: string]: any;
  #value = "";
  #length = 0;
  #indexMap: PropObj[] = [];

  constructor(propArray: Prop[]) {
    let startPos = 0;
    propArray.forEach((e) => {
      const pic = this.#parsePIC(e.pic);
      const propObj = {
        n: e.name,
        v: "",
        i: startPos,
        l: pic.l,
        t: pic.t,
        hasSign: pic.hasSign ?? false,
        dotPos: pic.dotPos ?? undefined,
      };
      this.#buildProp(propObj, startPos);
      startPos += pic.l;
      this.#indexMap.push(propObj);
    });
    this.#length = startPos;
    Object.seal(this);
  }

  /**
   * Set the values of all properties using a COBOL data block.
   */
  setValue(value: string | number) {
    const str = String(value);
    if (str.length != this.#length) {
      throw new Error(`Expected string of length ${this.#length}`);
    }
    this.#indexMap.forEach((elem) => {
      const startVal = str.slice(elem.i, elem.i + elem.l);
      let endVal;
      if (elem.t === "number") {
        endVal = Number(startVal);
        if (isNaN(endVal)) {
          throw new Error(
            `Expected a number on property ${elem.n}, instead received ${startVal}`
          );
        }
      }
      if (elem.t === "string") endVal = startVal.trim();
      this[elem.n] = endVal;
    });
  }

  /**
   * Return the current value of the COBOL data block.
   */
  getValue() {
    return this.#value;
  }

  /**
   * Return an array with all the properties names.
   */
  getProperties() {
    return Object.entries(Object.getOwnPropertyDescriptors(this))
      .filter(([_key, descriptor]) => typeof descriptor.get === "function")
      .map(([key]) => key);
  }

  #buildProp(propObj: PropObj, startIndex: number) {
    Object.defineProperty(this, propObj.n, {
      get: function () {
        if (propObj.t == "string") return propObj.v;
        return Number(propObj.v);
      },
      set: function (newValue) {
        if (propObj.t === "number") {
          const conv = Number(newValue);
          if (isNaN(conv)) {
            throw new Error(
              `Expected a number on property ${propObj.n}, instead received ${newValue}`
            );
          }
        }
        const str = String(newValue);
        const val = str.slice(0, propObj.l);
        if (str.length > val.length) {
          throw new Error(
            `Value ${str} too big, maximum length of ${val.length}`
          );
        }
        this.#replaceStrSlice(startIndex, val, propObj.l, propObj.t);
        propObj.v = val;
      },
    });
  }

  #parsePIC(e: string): Pic {
    try {
      let length = 0;
      // Get name
      const result: any = {};
      // Get type
      const pic = e.toUpperCase();
      if (pic[0] === "X") {
        result.t = "string";
      } else {
        result.t = "number";
      }
      // Get length of string
      if (result.t === "string") {
        result.l = Number(pic.slice(2, pic.length - 1));
      }
      // Get sign, decimal position and length of number
      if (result.t === "number") {
        let modPic = pic;
        if (pic[0] === "S") {
          result.hasSign = true;
          length++;
          modPic = pic.slice(1);
        }
        const modSlices = modPic.split(")");
        modSlices.forEach((slice) => {
          if (slice.length === 0) return;
          const num = Number(slice.split("(")[1]);
          length += num;
          if (slice[0] === "V") {
            result.dotPos = num;
          }
        });
        result.l = length;
      }
      return result;
    } catch (error) {
      throw new Error(
        "Error parsing PIC, expecting PIC with format X(10), 9(5), S9(3)V9(2) or similar"
      );
    }
  }

  // @ts-expect-error
  #replaceStrSlice(
    startInd: number,
    str: string,
    len: number,
    type: "string" | "number"
  ) {
    const preStr = this.#value.slice(0, startInd);
    const postStr = this.#value.slice(startInd + len);
    const padStr = this.#buildPadding(str, len, type);
    this.#value = preStr + padStr + postStr;
  }

  #buildPadding(str: string, len: number, type: "string" | "number") {
    if (str.length == len) return str;
    const missing = len - str.length;
    let padding = "";
    if (type === "number") {
      while (padding.length < missing) {
        padding += "0";
      }
      return padding + str;
    } else {
      while (padding.length < missing) {
        padding += " ";
      }
      return str + padding;
    }
  }
}
