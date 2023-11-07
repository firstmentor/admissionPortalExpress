const express = require('express')
const frontController = require('./controller/frontController')
const app = express()
// console.log(app)
const port = 4000
const web = require('./routes/web')
const connectDB = require('./db/connectDB')
const fileUpload = require('express-fileupload')
//for getting token from cookies
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//Tempfiles uploaderz
app.use(fileUpload({useTempFiles:true}))
// database Connectivity
connectDB()

//routing      *This is done in web.js file*
// app.get('/', frontController.home)
// app.get('/team', frontController.team)
// app.get('/about', frontController.about)
// app.get('/contact', frontController.contact)

const session = require('express-session')
const flash = require('connect-flash')

//session
app.use(session({
    secret:'secret',
    cookie:{maxAge:60000},
    resave:false,
    saveUninitialized:false
}));

app.use(flash());


// static files setup
app.use(express.static('public'))

// EJS setup
app.set('view engine','ejs')

//body parse -- covert simple form data into object form  that is needed to req.body
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))


//loading router
app.use('/',web)

app.listen(port,() => {
    console.log(`server start port localhost:${port}`)
})

