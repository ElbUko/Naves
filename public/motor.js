function actualizaNave(){
	V.prota.objEsp.vel = atualizaVelocidad();
	V.prota.objEsp.theta = actualizaGiro();
	actualizaPosicion();
	actualizaPantalla();
}
function actualizaPosicion(){
    if (V.prota.acciones.pisandoAce)
    	V.prota.dirInercia = V.prota.objEsp.theta;
    dx = Math.floor(Math.cos(V.prota.dirInercia * Math.PI / 180) * V.prota.objEsp.vel);
    dy = Math.floor(Math.sin(V.prota.dirInercia * Math.PI / 180) * V.prota.objEsp.vel);
    
    coliderMuros();
    
    V.prota.objEsp.x += dx;
    V.prota.objEsp.y += dy;
}
function atualizaVelocidad(){
	vel = V.prota.objEsp.vel;
    if (V.prota.accion.pisandoAce && vel < C.vels.maxNave){
    	vel += 1;
    } else if (!V.prota.accion.pisandoAce && vel > 0){
    	vel = vel >= C.vels.minPaDesplazarConInercia
			? vel * C.vels.coefRozamiento
			: 0;
    }
    return vel;
}
function actualizaGiro(){
	var angulo = V.prota.objEsp.theta;
    var sentidoHorario = 0;
    if (V.prota.accion.giraD) sentidoHorario = 1;
    if (V.prota.accion.giraI) sentidoHorario = -1;
    var velGiro = V.prota.objEsp.vel > 0
    	? C.vels.giroNave
    	: 1;
    angulo += (sentidoHorario * velGiro);
    if (angulo < 0) angulo += 360;
    if (angulo >= 360) angulo -= 360;
    return angulo;
}
function colliderMuros(){
	var mx1 = Math.floor((V.prota.objEsp.x+mundos.piezaLen/2) / mundos.mundoLen);
    var my1 = Math.floor((V.prota.objEsp.y+mundos.piezaLen/2) / mundos.mundoLen);
    var px1 = Math.floor(((V.prota.objEsp.x+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen);
    var py1 = Math.floor(((V.prota.objEsp.y+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen);
    var mx2 = Math.floor((V.prota.objEsp.x+dx+mundos.piezaLen/2) / mundos.mundoLen);
    var my2 = Math.floor((V.prota.objEsp.y+dy+mundos.piezaLen/2) / mundos.mundoLen);
    var px2 = Math.floor(((V.prota.objEsp.x+dx+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen);
    var py2 = Math.floor(((V.prota.objEsp.y+dy+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen);
       
    var colision = (mundos.mundos[my2] != undefined
                && mundos.mundos[my2][mx2] != undefined
                && mundos.mapas[mundos.mundos[my2][mx2]][py2][px2] != undefined);
       
    if (colision){
    	V.prota.objEsp.vel = 0;
    	V.prota.dirInercia = 0;
    	V.prota.mundo = [mx1,my1];
    	V.prota.casilla = [px1,py1];
    } else {        
    	V.prota.mundo = [mx2,my2];
    	V.prota.casilla = [px2,py2];
    }
}
function actualizaPantalla(){
	if ((V.prota.objEsp.x - V.panta.x <= C.dims.margenNavePant)
      || ((V.panta.x + V.panta.w) - V.prota.objEsp.x <= C.dims.margenNavePant)){
        V.panta.x += dx;
    }
    if ((V.prota.objEsp.y - V.panta.y <= C.dims.margenNavePant)
      || ((V.panta.y + V.panta.h) - V.prota.objEsp.y <= C.dims.margenNavePant)){
        V.panta.y += dy;
    }
}
