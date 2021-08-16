const express = require("express")
const auth_middleware = require('../middleware/auth')
const multer = require('multer')
const { createUser, deleteUser, updateUser, userProfile, loginUser, logoutUser, logoutAllSesions, uploadAvatar, getAvatar, deleteAvatar } = require('../controllers/userController')
const router = new express.Router()

router.post('/users', createUser)
router.patch('/users/me', auth_middleware, updateUser)
router.delete('/users/me', auth_middleware, deleteUser)
router.get('/users/profile', auth_middleware, userProfile)

router.post('/users/login', loginUser)
router.post('/users/logout', auth_middleware, logoutUser)
router.post('/users/logoutAll', auth_middleware, logoutAllSesions)

// Avatar Profile picture:
const upload = multer({
    limits: { fileSize: 1000000 }, //1MB restriction 
    fileFilter(req, file, cb) {
        const allowedFormats = ['jpg', 'jpeg', 'png']
        if (!allowedFormats.includes(file.mimetype.split('/')[1]))
            return cb(new Error("Unsupported file format, try uploading on of these: " + allowedFormats.join(", ")))
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth_middleware, upload.single('avatar'), uploadAvatar, (error, req, res, next) => res.status(400).send({ error: error.message }))
router.get('/users/me/avatar', auth_middleware, getAvatar)
router.delete('/users/me/avatar', auth_middleware, upload.single('avatar'), deleteAvatar)

module.exports = router