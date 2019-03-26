const notFound = require('./handlers/notFound');
const ping = require('./handlers/ping');
const userHandlers = require('./handlers/users');
const tokenHandlers = require('./handlers/tokens');
const menuHandlers = require('./handlers/menu');
const cartHandlers = require('./handlers/carts');
const paymentHandlers = require('./handlers/payment');

const router = {};

router.notFound = notFound;

router.ping = {};
router.ping.get = ping;

router.user = {};
router.user.list= {};
router.user.get = userHandlers.getUser;
router.user.post = userHandlers.createUser;
router.user.put = userHandlers.updateUser;
router.user.delete = userHandlers.removeUser;

router.users = {};
router.users.get = userHandlers.getUsers;

router.token = {};
router.token.post = tokenHandlers.createToken;
router.token.get = tokenHandlers.getTokens;
router.token.put = tokenHandlers.editToken;
router.token.delete = tokenHandlers.removeToken;

router.login = {};
router.login.post = tokenHandlers.createToken;

router.logout = {};
router.logout.post = tokenHandlers.removeToken;

router.menuItem = {};
router.menuItem.get = menuHandlers.getMenuItem;
router.menuItem.post = menuHandlers.createMenuItem;
router.menuItem.put = menuHandlers.editMenuItem;
router.menuItem.delete = menuHandlers.removeMenuItem;

router.menuItems = {};
router.menuItems.get = menuHandlers.getMenuItems;


router.cart = {};
router.cart.get = cartHandlers.getCart;
router.cart.post = cartHandlers.createCart;
router.cart.delete = cartHandlers.removeCart;

router['cart/add'] = {};
router['cart/add'].put = cartHandlers.addToCart;

router['cart/remove'] = {};
router['cart/remove'].put = cartHandlers.removeFromCart;

router.payment = {};
router.payment.post = paymentHandlers.pay;



module.exports = router;