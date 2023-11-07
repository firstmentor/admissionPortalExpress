const CoursemodelP = require('../models/Course')
const UserModelP = require('../models/User')
const bcrypt = require('bcrypt')
const cloudinary = require("cloudinary").v2
const jwt = require('jsonwebtoken')
cloudinary.config({
    cloud_name: "duuucqyup",
    api_key: "221722513646997",
    api_secret: "ebJJomXpac9DQlEUlkBbL9lef-M",
    secure: false,
})

class FrontController {

    static home = async (req, res) => {
        try {
            const { name, image, _id, email } = req.user
            // const btech = await CoursemodelP.findOne({userID:_id, course:'BTech'})
            const btech = await CoursemodelP.findOne({ userId: _id, course: 'Btech' })
            const bca = await CoursemodelP.findOne({ userId: _id, course: 'BCA' })
            const mtech = await CoursemodelP.findOne({ userId: _id, course: 'Mtech' })

            res.render('Home', { n: name, i: image, e: email, b: btech, bca: bca, m: mtech })
        } catch (error) {
            console.log(error)
        }
    }

    static about = (req, res) => {
        try {
            const { name, image, _id} = req.user
            res.render('About',{n:name, i:image})
        } catch (error) {
            console.log(error)
        }
    }

    static admission = async (req, res) => {
        try {
            const { name, image, _id, email } = req.user
            // const btech = await CoursemodelP.findOne({userID:_id, course:'BTech'})
            const btech = await CoursemodelP.findOne({ userId: _id, course: 'Btech' })
            const bca = await CoursemodelP.findOne({ userId: _id, course: 'BCA' })
            const mtech = await CoursemodelP.findOne({ userId: _id, course: 'Mtech' })

            res.render('admission', { n: name, i: image, e: email, b: btech, bca: bca, m: mtech })
        } catch (error) {
            console.log(error)
        }
    }

    static clubs = (req, res) => {
        const{name , image} = req.user
        try {
            res.render('clubs',{n:name , i:image})
        } catch (error) {
            console.log(error)
        }
    }
    static contact = (req, res) => {
        try {
            res.render('contact')
        } catch (error) {
            console.log(error)
        }
    }
    static login = (req, res) => {
        try {
            res.render('Login', { msg2: req.flash('error') })
        } catch (error) {
            console.log(error)
        }
    }
    static registration = (req, res) => {
        try {
            res.render('Registration', { message: req.flash('error') })
        } catch (error) {
            console.log(error)
        }
    }

    static userInput = async (req, res) => {
        // console.log(req.files.image)
        const imagefile = req.files.image
        const imageupload = await cloudinary.uploader.upload(imagefile.tempFilePath, {
            folder: 'profileImage'
        })
        // console.log(imageupload)
        // console.log(imagefile)
        const { n, e, p, cp } = req.body
        const user = await UserModelP.findOne({ email: e })
        // console.log(email, "hey")
        if (user) {
            req.flash('error', 'Email already exists')
            res.redirect('/registration')
        } else {
            if (n && e && p && cp) {
                if (p == cp) {
                    try {
                        const hashed_pass = await bcrypt.hash(p, 10)
                        // console.log(req.body)
                        const result = new UserModelP({
                            name: n,
                            email: e,
                            password: hashed_pass,
                            image: {
                                public_id: imageupload.public_id,
                                url: imageupload.secure_url
                            }
                        })
                        await result.save()
                        res.redirect('/login')
                    }
                    catch (error) {
                        console.log(error)
                    }
                } else {
                    req.flash('error', 'Password does not match')
                    res.redirect('/registration')
                }
            } else {
                req.flash('error', 'Fill the complete details to proceed')
                res.redirect('/registration')
            }
        }
    }

    static verifyLogin = async (req, res) => {
        try {
            //  console.log(req.body)
            const { email, password } = req.body
            const user = await UserModelP.findOne({ email: email })
            if (email && password) {
                if (user != null) {
                    const is_matched = await bcrypt.compare(password, user.password)
                    if (is_matched) {
                        if (user.role == 'admin') {
                            //generate token using id and secret key
                            const token = jwt.sign({ id: user._id }, 'yash14')
                            // console.log(token)
                            res.cookie('token', token)
                            res.redirect('/admin/getAllData')
                        }
                        if (user.role == 'student') {
                            //generate token using id and secret key
                            const token = jwt.sign({ id: user._id }, 'yash14')
                            // console.log(token)
                            res.cookie('token', token)
                            res.redirect('/dashboard')
                        }


                    } else {
                        req.flash('error', 'Password is incorrect')
                        res.redirect('/')
                    }
                } else {
                    req.flash('error', 'This Email is not registered')
                    res.redirect('/')
                }
            } else {
                req.flash('error', 'Please enter all your credentials')
                res.redirect('/')
            }
        } catch (error) {
            console.log(error)

        }
    }
    //logout method
    static logout = async (req, res) => {
        try {
            res.clearCookie('token')
            res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    }
    //profile method
    static profile = async (req, res) => {
        try {
            const { name, image, _id, email, phone } = req.user
            //finding no of courses of an user
            const coursesCount = await CoursemodelP.find({ userId: _id })
            // console.log(coursesCount.length)

            res.render('profile', { n: name, i: image, e: email, p: phone, cc: coursesCount, msg: req.flash('error'), msg1: req.flash('success') })

        } catch (error) {
            console.log(error)
        }
    }
    //profile password change
    static updatePassword = async (req, res) => {
        try {
            // console.log(req.body)
            const { currentpass, npass, cpass } = req.body
            const { id } = req.user
            if (currentpass && npass && cpass) {
                const user = await UserModelP.findById(id)
                const isMatched = await bcrypt.compare(currentpass, user.password)
                console.log(isMatched)
                if (!isMatched) {
                    req.flash('error', 'Current password is incorrect ')
                    res.redirect('/profile')
                } else {
                    if (npass != cpass) {
                        req.flash('error', 'Password does not match')
                        res.redirect('/profile')
                    } else {
                        const newHashPassword = await bcrypt.hash(npass, 10)
                        await UserModelP.findByIdAndUpdate(id, {
                            password: newHashPassword
                        })
                        req.flash('success', 'Password Updated successfully ')
                        res.redirect('/login')
                    }
                }
            } else {
                req.flash('error', 'ALL fields are required ')
                res.redirect('/profile')
            }
        } catch (error) {
            console.log(error)
        }
    }
    //method for updating profile
    static updateProfile = async (req, res) => {
        try {
            const { id } = req.user
            const { name, email, phone, image } = req.body
            //console.log(req.files.image)
            if (req.files) {
                const user = await UserModelP.findById(id)
                const imageID = user.image.public_id
                // console.log(imageID)

                //deleting image from Cloudinary
                await cloudinary.uploader.destroy(imageID)
                //new image update
                const imagefile = req.files.image
                const imageupload = await cloudinary.uploader.upload(imagefile.tempFilePath, {
                    folder: 'profileImage'
                })
                var data = {
                    name: name,
                    email: email,
                    phone: phone,
                    image: {
                        public_id: imageupload.public_id,
                        url: imageupload.secure_url
                    }
                }
            } else {
                var data = {
                    name: name,
                    email: email,
                    phone: phone
                }
            }
            await UserModelP.findByIdAndUpdate(id, data)
            req.flash('success', "Update Profile successfully")
            res.redirect('/profile')
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = FrontController