const CoursemodelP = require('../models/Course')
const nodemailer = require('nodemailer')
class CourseController {

    static courseInput = async (req, res) => {
        // console.log(req.body)
        try {
            const { naame, image, _id } = req.user;
            const { name, email, course, phone, city, address } = req.body
            const result = new CoursemodelP({
                name: name,
                email: email,
                course: course,
                phone: phone,
                city: city,
                address: address,
                userId: _id
            })
            await result.save()
            //calling sendEmail()
            this.sendEmail(name,email,course)

            res.redirect('/course_display')
        }
        catch (error) {
            console.log(error)
        }
    }
    //method for viewing course

    static courseDisplay = async (req, res) => {
        try {
            const { name, image, _id, email } = req.user
            const data = await CoursemodelP.find()
            const btech = await CoursemodelP.find({ course: 'Btech' })

            // console.log(req.params.id)
            res.render('display', { d: data, n: name, i: image, b: btech, id: _id })
        }
        catch (error) {
            console.log(error)
            // res.redirect('/course_display')

        }

    }

    static viewButton = async (req, res) => {
        try {
            const { name, image, _id } = req.user
            // console.log(req.params.id)
            const data = await CoursemodelP.findById(req.params.id)
            // console.log(data)
            res.render('viewbutton', { d: data, n: name, i: image })
        }
        catch (error) {
            console.log(error)

        }
    }

    static editButton = async (req, res) => {
        try {
            const { name, image, _id } = req.user
            // console.log("editbutton id : ",req.params.id)
            const data = await CoursemodelP.findById(req.params.id)
            // console.log(data)
            res.render('editbutton', { d: data, n: name, i: image })
        }
        catch (error) {
            console.log(error)

        }
    }

    static course_update = async (req, res) => {
        // console.log(" req.params.id :", req.params.id)
        try {
            // const yash = await CoursemodelP.findById(req.params.id)
            // console.log(yash)
            console.log('Before update operation');

            const data = await CoursemodelP.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                city: req.body.city,
                address: req.body.address
            },
                { new: true }
            )//.exec();
            console.log('After   update operation');
            console.log("data: ", data)
            // data.getQuery();
            // console.log(data)
            // data.select('name')
            // data.then(che=>{
            //   console.log("data: ",data)  
            //   console.log("yoooooooo")  
            //   console.log(data)

            //   console.log(che)  

            // })


            if (!(data)) {
                // Handle the case where the document with the specified ID is not found
                return res.status(404).send('Course not found');
            }

            // Redirect after successful update
            res.redirect('/course_display');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error'); // Handle the error more gracefully
        }
    }

    static deleteButton = async (req, res) => {
        try {
            const data = await CoursemodelP.findByIdAndDelete(req.params.id)
            res.redirect('/course_display')
        }
        catch (error) {
            console.log(error)
        }
    }
    //email send
    static sendEmail = async (name,email,course) => {
        // console.log(name,email,course)
        // connenct with the smtp server

        let transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,

            auth: {
                user: "yshrivastava1404@gmail.com",
                pass: "zlbmhyflzfbwraxq",
            },
        });
        let info = await transporter.sendMail({
            from: "test@gmail.com", // sender address
            to: email, // list of receivers
            subject: `Course Registration Succesfully, Please Wait for approval`, // Subject line
            text: "heelo", // plain text body
            html: `<b>${name}</b> Registration for <b>${course}</b> successful! `, // html body
        });
    };

}

module.exports = CourseController