const notFound = require('./handlers/notFound');
const ping = require('./handlers/ping');
const userHandlers = require('./handlers/users');
const tokenHandlers = require('./handlers/tokens');

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

router.tokens = {};
router.tokens.post = tokenHandlers.createToken;
router.tokens.get = tokenHandlers.getTokens;
router.tokens.put = tokenHandlers.editToken;
router.tokens.delete = tokenHandlers.removeToken;

module.exports = router;