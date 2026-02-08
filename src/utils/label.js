export const UNIT_LABELS = {
  g: "g",
  kg: "kg",
  ml: "ml",
  l: "l",
};

export const getUnitPrice = (price, weightValue, weightUnit) => {
  const priceNum = Number(price);
  const weightNum = Number(weightValue);
  if (!priceNum || !weightNum) return 0;

  if (weightUnit === "kg" || weightUnit === "l") {
    return priceNum / weightNum;
  }

  if (weightUnit === "g" || weightUnit === "ml") {
    return (priceNum * 1000) / weightNum;
  }

  return 0;
};

export const getUnitPriceLabel = (weightUnit) => {
  if (weightUnit === "l" || weightUnit === "ml") return "€/l";
  return "€/kg";
};
