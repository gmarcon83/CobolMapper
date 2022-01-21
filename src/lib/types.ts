export type Prop = {
  name: string;
  pic: string;
};

export type Pic = {
  l: number;
  t: "string" | "number";
  hasSign?: boolean;
  dotPos?: number;
};

export type PropObj = {
  n: string;
  v: string | number;
  i: number;
  l: number;
  t: "string" | "number";
  hasSign: boolean;
  dotPos?: number;
};
