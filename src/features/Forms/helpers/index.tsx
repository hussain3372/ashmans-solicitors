export const transformName = (name: string) => {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("Bmc", "BMC")
    .replace("Dscc", "DSCC");
};

export const getClassNames = (attributesList) => {
  return Object.keys(attributesList)
    .filter((key) => attributesList[key])
    .join(" ");
};
