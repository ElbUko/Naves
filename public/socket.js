
var socket = io();

socket.on();

socket.emit('nuevo');

socket.on('nuevo', function(data){
	meteOtro(data);
});

socket.on('estaba', function(data){
	meteOtro(data);
});

function enviaBroadcast(){
	socket.emit('mueveOtro', {
		x : V.prota.x,
		y : V.prota.y,
		t : V.prota.theta,
		d : ac.dispara && V.prota.recarga >= C.vels.protRecarga
	});
}

socket.on('mueveOtro', function(data){
	if (V.otro != undefined){
		V.otro.x = data.x;
		V.otro.y = data.y;
		V.otro.theta = data.t;
		if (data.d){
			otroDispara();
		}
	}
})