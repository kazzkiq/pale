/**
 * Validators consist of pure functions.
 * Those functions always return a boolean
 * true = validation passed
 * false = validation error
 */

export const validators = {
  string(value) {
    return !/[\d]+/g.test(value);
  },
  number(value) {
    if (!value) return false;
    return !/[\D]+/g.test(value);
  },
  min(value, size) {
    if (isNaN(+value)) return false;
    if (isNaN(+size)) return false;
    return +value >= +size;
  },
  max(value, size) {
    if (isNaN(+value)) return false;
    if (isNaN(+size)) return false;
    return +value <= +size;
  },
  minLength(value, size) {
    if (!value) return false;
    if (isNaN(+size)) return false;
    return value.length >= +size;
  },
  maxLength(value, size) {
    if (!value) return false;
    if (isNaN(+size)) return false;
    return value.length <= +size;
  }
}