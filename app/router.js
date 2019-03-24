const notFound = require('./handlers/notFound');
const ping = require('./handlers/ping');
const userHandlers = require('./handlers/users');
const tokenHandlers = require('./handlers/tokens');
const menuHandlers = require('./handlers/menu');

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

router.menu = {};
router.menu.get = menuHandlers.getMenuItems;
router.menu.post = menuHandlers.createMenuItem;
router.menu.put = menuHandlers.editMenuItem;
router.menu.delete = menuHandlers.removeMenuItem;

router['menu/item'] = {};
router['menu/item'].get = menuHandlers.getMenuItems;


module.exports = router;