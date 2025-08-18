/**
 * db/keyBuilder.js
 */

export const Keys = {
  user: (uid) => ({
    pk: `USER#${uid}`,
    profileSK: 'PROFILE',
    roleSK: 'ROLE',
    cartSK: (productId) => `CART#${productId}`,
    orderSK: (orderId) => `ORDER#${orderId}`,
    librarySK: (itemId) => `LIBRARY#${itemId}`
  }),
  product: (sku) => ({
    pk: `PRODUCT#${sku}`,
    metaSK: 'META',
  }),
};
