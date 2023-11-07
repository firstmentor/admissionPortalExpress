const jwt = require('jsonwebtoken')
const UsermodelP = require('../models/User')

const checkAuth = async (req, res, next) => {
    // console.log("Hello Middleware")
    const { token } = req.cookies
    // console.log(token)
    if (!token) {
        req.flash('error', 'Unauthorised user please login')
        res.redirect('/login')
    } else {
        const verifyToken = jwt.verify(token, 'yash14')
        // console.log(verifyToken)
        const data = await UsermodelP.findOne({ _id: verifyToken.id })
        // console.log(data)

        req.user = data;
        // const {name,image,id}=req.
        next()
    }

}
module.exports = checkAuth
