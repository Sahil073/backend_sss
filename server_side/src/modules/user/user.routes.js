const {Router} = require('express')

const userController = require('./user.controller')
const auth = require('../../middleware/auth')

const router = Router()

router.get('/profile', auth, userController.getProfile)
router.patch('/profile', auth, userController.updateProfile)

module.exports = router 
