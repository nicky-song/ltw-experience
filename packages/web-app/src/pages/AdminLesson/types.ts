export type DrawerContext = {
  isDrawerOpen: boolean;
  setIsDrawerOpen: (val: boolean) => void;
  learningItemId?: string;
  learningItemType?: string;
};
