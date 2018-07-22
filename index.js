const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection' , socket => {
   console.log('User connected');
   socket.on('disconnect', () => {
      console.log('User disconnected');
   });
});

http.listen(5432,() => {
   console.log('Listening on port 5432');
});