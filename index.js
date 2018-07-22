const app = require('express')();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const httpCodes = require('http-codes');

const dbConfig = require('./config/database');

let http,io;

mongoose.Promise = Promise;
mongoose.connect(dbConfig.credentials.mongoUrl + dbConfig.credentials.mongoDb);

let dbConnection = mongoose.connection;

dbConnection.on('error', error => {
   console.log('Unable to connect to mongo');
   console.log(error.toString());
});

dbConnection.once('open', () => {
    console.log('Connected to mongo');
})

app.set('view engine', 'pug');
app.use(cors());
app.use(bodyParser.json());

app.use('/api/requests',require('./api/requests'));

app.get('/customerapp.html',(req,res) =>{
    res.sendFile( __dirname +'/webpages/customer.html');
});
app.get('/dashboard.html',(req,res) =>{
    res.sendFile( __dirname +'/webpages/dashboard.html');
});
app.get('/driverapp.html/:id',(req,res) =>{
    res.render('driver',{ id : req.params.id });
});

app.all('*', (req,res) => {
    res.status(httpCodes.NOT_FOUND);
    res.send();
})


http = require('http').Server(app);
io = require('socket.io')(http);

io.on('connection' , socket => {
   console.log('User connected');
   socket.on('Accept Request', () => {
       console.log('Request accepted by driver');
       io.emit('Accept Request', { for: 'everyone' });
   });
   socket.on('New Request', () => {
        console.log('New request created by customer');
        io.emit('New Request', { for: 'everyone' });
   });
   socket.on('disconnect', () => {
      console.log('User disconnected');
   });
});

http.listen(5432,() => {
   console.log('Listening on port 5432');
});