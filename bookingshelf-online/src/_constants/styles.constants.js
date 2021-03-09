export const BUTTON_COLORS = ['6A7187', '747474', '3B4B5C', '2A3042', '5B7465', '728399', 'A490F1', '7D785F', '991212', 'F7B83E', 'C959A3', '3E50F7'];

export const BUTTON_COLORS_BY_NUMBER = BUTTON_COLORS.reduce((colors, color) => ({ ...colors, [parseInt(color, 16)]: color }), {});
export const DEFAULT_BUTTON_COLOR="3E50F7";