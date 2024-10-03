export type Color = {
  colorName: string;
  colorHex: string;
  disabled?: boolean;
};

export type ColorsType = {
  textColor: Color[];
  backgroundColor: Color[];
};
