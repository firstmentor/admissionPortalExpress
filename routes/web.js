const express = require('express')
const FrontController = require('../controller/frontController')
const CourseController = require('../controller/courseController')
const checkAuth = require('../middleware/auth')
const AdminController = require('../controller/Admin/AdminController')
const router = express.Router()

router.get('/dashboard',checkAuth, FrontController.home)
router.get('/about',checkAuth,FrontController.about)
router.get('/admission',checkAuth,FrontController.admission)
router.get('/clubs',checkAuth,FrontController.clubs)
router.get('/',FrontController.login)
router.get('/registration',FrontController.registration)

// user input
router.post('/user_input', FrontController.userInput)
// course register
router.post('/course_input',checkAuth, CourseController.courseInput)
//view courses 
router.get('/course_display',checkAuth,CourseController.courseDisplay)
//view button display
router.get('/view/:id',checkAuth, CourseController.viewButton)

router.get('/edit/:id',checkAuth, CourseController.editButton)
router.post('/course_update/:id', CourseController.course_update)

router.get('/delete/:id',checkAuth, CourseController.deleteButton)

router.post('/verify_login',FrontController.verifyLogin)
//logout 
router.get('/logout',checkAuth,FrontController.logout )

//profile open
router.get('/profile',checkAuth,FrontController.profile )

//profile password change
router.post('/update_password',checkAuth,FrontController.updatePassword)
//update profile
router.post('/update_profile',checkAuth,FrontController.updateProfile)

//admin Controller
router.get('/admin/getAllData',checkAuth,AdminController.GetAllData )

//update status
router.post('/update_status/:id',checkAuth,AdminController.updateStatus)






module.exports = router