const express = require('express');
const auth = require('./auth/auth.js');
const general = require('./controller/general.js')
const router = express.Router();
/*session routes*/
router.post('/sessions', auth.login);
router.get('/sessions/current', auth.getCurrentSession);
router.delete('/sessions/current', auth.isLoggedIn, auth.logout);

/* general routes*/
router.get('/candidati', auth.isLoggedIn, general.getCandidati);
router.get('/uffici', auth.isLoggedIn, general.getUffici);
router.post('/newscrutinio', auth.isLoggedIn, general.insertNewScrutinio);

module.exports = router;