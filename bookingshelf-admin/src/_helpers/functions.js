export const mapEmptyObjFields = (obj) => Object.keys(obj).reduce((values, key) => ({ ...values, [key]: obj[key] || null }), {});
