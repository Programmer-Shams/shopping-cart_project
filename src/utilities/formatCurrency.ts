 // Purpose: This file contains a function that formats a number to a currency string.
 export const roundToTwoDecimalPlaces = (value: number): number => {
  return Math.round(value * 100) / 100;
};