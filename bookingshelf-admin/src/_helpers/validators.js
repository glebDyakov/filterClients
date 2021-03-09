export const isValidEmailAddress = (address) =>
  !!address.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/);

export const isValid = (value, regex) => regex.test(value);
