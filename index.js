var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var app = express();
var mongoose = require('mongoose');
var http = require('http').Server(app);
var Account = require('./models/account');
var io = require('socket.io')(http);


app.set('views', './views');
app.set('view engine', 'pug');
mongoose.connect('mongodb://localhost/webdxd');
app.use(express.static('statics'));

app.use(require('express-session')({
    secret:'123',
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

var studentSchema = {
    firstName:String,
    lastName: String,
    age: Number,
    email: String
};
var student = mongoose.model('Student', studentSchema, 'students');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//
app.get('/', function(req,res) {
    res.sendfile('./views/index.html');
});



// student list page
app.get('/api/students/', function (req, res) {
    student.find().exec(function (err,doc) {
       if (err) {
           console.log(err);
       }else{
           //console.log(doc);
           res.send(doc);
           //res.render('index', {title:'webdxd Students', students:doc});
       }
    });
});

app.get('/api/students/:id', function (req,res) {
    var studentId = req.params.id;
    student.findById(studentId, function (err, doc) {
        if (err) {
            console.log(err)
        } else {
            res.send(doc);
            // res.render('student',{student: doc});
        }
    });
});



// go to student page
app.get('/student/:id', function (req,res) {
    var studentId = req.params.id;
    student.findById(studentId, function (err, doc) {
        if (err) {
            console.log(err)
        } else {
            res.render('student',{student: doc});
        }
    });
});

// delete record
app.get('/api/students/delete/:id', function (req, res) {
    student.findOneAndRemove({_id:req.params.id},function (err,doc) {
            if (err) {
                console.log(err);
            } else {

                res.send(doc);
            }
        }
    );
    //console.log(req.params.id);
});

// go to add page
app.get('/add/', function (req, res) {
    res.render('addform');
});

// go to edit page 
// app.get('/students/edit/:id', function (req,res) {
//     res.render('editform',{id:req.params.id});
//     // console.log(req.params.id);
// });


//Update record
app.post('/api/students/edit/:id', function (req, res) {
        var updteStudent = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            email: req.body.email
        };
        student.findOneAndUpdate({_id: req.body._id}, updteStudent, {new:true},function (err,doc) {
            if (err) {
                console.log(err);
            }else{

                res.send("Success!");
            }
        });

        //console.log(req.body);
    }
    );



// Insert new data
app.post('/api/students/new', function (req,res) {
    var newStudent = new student(req.body);
    newStudent.save(function (err, doc) {
        if (err) {
            console.log(err);
        }else{
            res.send(doc);
        }
    });
    //console.log(req.body);
});

app.get('/chat', function (req,res) {
   res.render('chat',{});
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

app.get('/login', function (req, res) {
    res.render('login', {});
});

app.get('/signup', function (req, res) {
    res.render('signup', {});
});

app.post('/signup', function (req, res) {
    Account.register(new Account({username:req.body.username}), req.body.password, function(err,account){
            if(err){
                res.render('signup',{message:err});
            }else{
                console.log(account);
                res.redirect('/');
            }
        }
    );
    console.log(req.body.username);

});


// app.listen(3000, function () {
//     console.log('Example app listening on port 3000!');
// });

http.listen(3000, function(){
    console.log('listening on *:3000');
});