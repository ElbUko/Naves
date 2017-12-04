// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));


var nave = function(id, x, y, t){
	this.id = id;
	this.x = x;	
	this.y = y;
	this.t = t;
}
var naves = []; 
var numUsers = 0;

io.on('connection', function (socket) {
	var addedUser = false;
	
	socket.yo;
	socket.on('nuevo', function(x,y,t){
		++numUsers;
		if (naves.length>0){
			data = naves[0];
			socket.emit('estaba', data);
		} else {
			data = {}
		}
		socket.yo = new nave(naves.length, x,y,t);
		naves.push(socket.yo);
		console.log('entra'+socket.yo.id+', hay: '+naves.length)
		socket.broadcast.emit('nuevo', data);
	});
	
	socket.on('mueveOtro', function(data){
		if (socket.yo != undefined){
			socket.yo.x = data.x;
			socket.yo.y = data.y;
			socket.yo.t = data.t;
		}
		socket.broadcast.emit('mueveOtro', data);
	});
  
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
    for (var i=0; i<naves.length; i++){
    	if (naves[i].id == socket.yo.id){
    		naves.splice(i,1);
    		console.log('sale '+socket.yo.id+', hay: '+naves.length)
    		break;
    	}
    }
  });
});
