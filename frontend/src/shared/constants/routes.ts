export const ROUTES = {
  MAIN: '/',
  SIGNIN: '/sign-in',
  SIGNUP: '/sign-up',
  CATALOG: '/catalog',
  PRODUCT: '/catalog/:id',
  CART: '/cart',
  CABINET: '/cabinet',
  CHECKOUT: '/checkout',
  SUCCESS: '/checkout-success',
  NOT_FOUND: '*',
} as const;
