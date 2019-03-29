const notFound = require('./handlers/notFound');
const ping = require('./handlers/ping');
const userHandlers = require('./handlers/users');
const tokenHandlers = require('./handlers/tokens');
const menuHandlers = require('./handlers/menu');
const cartHandlers = require('./handlers/carts');
const paymentHandlers = require('./handlers/payment');
const templateHandlers = require('./handlers/templateHandlers');

const router = {};

router.notFound = notFound;

router.ping = {};
router.ping.get = ping;

router['api/users'] = {};
router['api/users'].get = userHandlers.getUser;
router['api/users'].post = userHandlers.createUser;
router['api/users'].put = userHandlers.updateUser;
router['api/users'].delete = userHandlers.removeUser;
router['api/users/list'] = {};
router['api/users/list'].get = userHandlers.getUsers;

router['api/token'] = {};
router['api/token'].post = tokenHandlers.createToken;
router['api/token'].get = tokenHandlers.getTokens;
router['api/token'].put = tokenHandlers.editToken;
router['api/token'].delete = tokenHandlers.removeToken;

router['api/login'] = {};
router['api/login'].post = tokenHandlers.createToken;
router['api/logout'] = {};
router['api/logout'].post = tokenHandlers.removeToken;

router['api/menu'] = {};
router['api/menu'].get = menuHandlers.getMenuItem;
router['api/menu'].post = menuHandlers.createMenuItem;
router['api/menu'].put = menuHandlers.editMenuItem;
router['api/menu'].delete = menuHandlers.removeMenuItem;
router['api/menu/list'] = {};
router['api/menu/list'].get = menuHandlers.getMenuItems;


router['api/cart'] = {};
router['api/cart'].get = cartHandlers.getCart;
router['api/cart'].post = cartHandlers.createCart;
router['api/cart'].delete = cartHandlers.removeCart;
router['api/cart/add'] = {};
router['api/cart/add'].put = cartHandlers.addToCart;
router['api/cart/remove'] = {};
router['api/cart/remove'].put = cartHandlers.removeFromCart;

router['api/payment'] = {};
router['api/payment'].post = paymentHandlers.pay;

/**
 * FRONT
 */

router['public'] = templateHandlers.publicAssets;
router[''] = {};
router[''].get = templateHandlers.index;

module.exports = router;