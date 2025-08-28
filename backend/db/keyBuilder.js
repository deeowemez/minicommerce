/**
 * db/keyBuilder.js
 */

export const Keys = {
  user: (uid) => ({
    pk: `USER#${uid}`,
    profileSK: 'PROFILE',
    roleSK: 'ROLE',
    librarySK: (libraryId) => `LIBRARY#${libraryId}`,
    cartSK: (productId) => `CART#${productId}`,
    orderSK: (orderId) => `ORDER#${orderId}`,
  }),
  product: (sku) => ({
    pk: `PRODUCT#${sku}`,
    metaSK: 'META',
  }),
};
