

ctx.canvas.width  = window.innerWidth-4;
ctx.canvas.height = window.innerHeight-4;
var I = {
	img : [],
	ruta: 'img/',
	titulo : ['fondo', 'bala1', 'disp', 'nave0', 'nave1', 'nave2', 'nave3'],
	extension : '.gif'
}

for (i=0; i<I.imagsTit.length; i++){
	var img = new Image();
	img.src = I.ruta + I.titulo[i] + I.extension;
}

function pintaEscenario(){
    //limpio
    ctx.clearRect(0,0,canvas.width,canvas.height);
       
    //pinto fondo
    V.desplaEstrella += 0.1;
    if (V.desplaEstrella > C.imgSet.fondo) 
    	V.desplaEstrella -= C.imgSet.fondo;
    var xDesde = 0-((V.panta.x-500 + V.desplaEstrella) % C.imgSet.fondo);
    var xHasta = V.panta.w + C.imgSet.fondo;
    var yDesde = 0-((V.panta.y-500 + V.desplaEstrella) % C.imgSet.fondo);
    var yHasta = V.panta.h + C.imgSet.fondo;
    if (xDesde>0) xDesde = xDesde-C.imgSet.fondo;
    if (yDesde>0) yDesde = yDesde-C.imgSet.fondo;                
    for (var i=xDesde; i<=xHasta; i+=C.imgSet.fondo-1){
        for (var j=yDesde; j<=yHasta; j+=C.imgSet.fondo-1){
            pinta(fondo.x, fondo.y+1, fondo.w-1, fondo.h-1,
                    i, j, fondo.w, fondo.h, 'fondo');
        }
    }
    //pinto paredes (mundos)
    var mundoi = Math.floor(V.panta.x / mundos.mundoLen);
    var mundoj = Math.floor(V.panta.y / mundos.mundoLen);
    var nMundoX = Math.ceil(C.dims.cw / mundos.mundoLen)+1;
    var nMundoY = Math.ceil(C.dims.ch / mundos.mundoLen)+1;
    //recorro mundos a pintar
    for (var i=mundoi; i<mundoi+nMundoX; i++){
        for (var j=mundoj; j<mundoj+nMundoY; j++){
            if (mundos.mundos[j]!= undefined && mundos.mundos[j][i] != undefined){
                pintaMundo(i, j);
            }
        }
    }
}
function pintaMundo(mi, mj){
    var mundo = mundos.mapas[mundos.mundos[mj][mi]];
    if (mundo != undefined){
        var x0 = mi * mundos.mundoLen;
        var y0 = mj * mundos.mundoLen;
        ctx.save();
        ctx.translate(x0-V.panta.x, y0+-V.panta.y );            
        for (var i=0; i<mundo[0].length; i++){
            for (var j=0; j<mundo.length; j++){
                if (mundo[j][i] != undefined){
                    var o = C.imgSet.muro[[mundos.piezas[mundo[j][i]]]];
                    pinta(o.x, o.y, o.w, o.h,
                        i*mundos.piezaLen-o.w/2, j*mundos.piezaLen-o.h/2, mundos.piezaLen, mundos.piezaLen, 'muro');
                }
                //pinto rejilla (solo para debug)
                if (C.config.pintaRejilla){
                    ctx.strokeStyle = '#fff'
                    ctx.strokeRect(i*mundos.piezaLen-50,j*mundos.piezaLen-50,mundos.piezaLen, mundos.piezaLen);
                }
            }
        }
        //Para debug, muestra el camino de la IA
        if (C.config.muestraCamino && V.debug.caminoSalida[0] == mi && V.debug.caminoSalida[1] == mj){
            for (var i=0; i< V.debug.caminoSalida[2].length; i++){
                ctx.strokeStyle = '#fff'
                ctx.strokeRect(V.debug.caminoSalida[2][i].x*mundos.piezaLen-10,
                               V.debug.caminoSalida[2][i].y*mundos.piezaLen-10,20, 20);
            }
        }
        ctx.restore();
    }
}
   
   
function pintaDinamicas(){
    //pinto balas
    for (var i=0; i<V.balas.length; i++){
        ctx.save();
        ctx.translate(V.balas[i].x - V.panta.x, V.balas[i].y - V.panta.y );
        ctx.rotate(V.balas[i].theta * Math.PI / 180);
        pinta(C.imgSet[V.balas[i].tipo].x, C.imgSet[V.balas[i].tipo].y,
                            C.imgSet[V.balas[i].tipo].w, C.imgSet[V.balas[i].tipo].h,
                    0, -2, C.imgSet[V.balas[i].tipo].w, C.imgSet[V.balas[i].tipo].h, 'balaM');
        ctx.restore();
    }
    //pinto malos
    for (var i=0; i<V.malos.length; i++){
        ctx.save();
        ctx.translate(V.malos[i].x - V.panta.x, V.malos[i].y - V.panta.y );
        ctx.rotate(V.malos[i].theta * Math.PI / 180);
        pinta(C.imgSet.malo1.x, C.imgSet.malo1.y, C.imgSet.malo1.w, C.imgSet.malo1.h,
                    -C.dims.fra.prota/2, -C.dims.fra.prota/2, C.dims.fra.prota, C.dims.fra.prota, 'malo');
        ctx.restore();
    }
       
    //pinto nave
    ctx.save();
    ctx.translate(V.prota.x - V.panta.x, V.prota.y - V.panta.y );
    ctx.rotate(V.prota.theta * Math.PI / 180);
    var frame = frameNave();
    pinta(frame.x, frame.y, frame.w, frame.h-2,
            -C.dims.fra.prota/2, -C.dims.fra.prota/2, frame.w, frame.h, 'prota');
    if (ac.dispara){
        //disparo de la nave
        pinta(C.imgSet.efDisp.x, C.imgSet.efDisp.y, C.imgSet.efDisp.w, C.imgSet.efDisp.h,
            C.dims.fra.prota/2-C.dims.fra.efDis/2, -C.dims.fra.efDis/2, C.imgSet.efDisp.w, C.imgSet.efDisp.h, 'dispN');
    }
    ctx.restore();
       
    //pinto explosiones
    for (var i=0; i<V.explos.length; i++){
        ctx.save();
        ctx.translate(V.explos[i].x - V.panta.x, V.explos[i].y - V.panta.y );
        ctx.rotate(V.explos[i].theta * Math.PI / 180);
        var frame = 'e'+V.explos[i].frame;
        pinta(C.imgSet.exp[frame].x, C.imgSet.exp[frame].y, C.imgSet.exp[frame].w, C.imgSet.exp[frame].h,
            -C.dims.fra.prota/2, -C.dims.fra.prota/2, C.imgSet.exp[frame].w, C.imgSet.exp[frame].h, 'explo');
        ctx.restore();
    }
}

function pinta(x, y, dx, dy, sx, sy, sdx, sdy, elemento){
    if (C.config.conImagen){
        ctx.drawImage(imgSet, x, y, dx, dy, sx, sy, sdx, sdy);
    } else {
        ctx.fillStyle = obtenColor(elemento);
        ctx.fillRect(x, y, dx, dy);
    }
}

function obtenColor(elemento){
    var color = '';
    switch (elemento) {
        case 'fondo' :
            color = '#000';
            break;
        case 'explo' : 
            color = '#aa3';
            break;
        case 'dispN' :
            color = '#f11';
            break;
        case 'malo' :
            color = '#666';
            break;
        case 'balaM' : 
            color = '#a4a';
            break;
        case 'prota':
            color = '#2a2';
            break;
        case 'muro' :
            color = '#2aa';
    }
}
   
//Funcion para pintar vida, puntos...
function pintaCuadroInfo(){
    var frame = C.imgSet.prota.quieto;
    ctx.save();
    ctx.translate(V.panta.w - C.dims.cuadroInfo.w, 0);
    //nave
    ctx.rotate(-90 * Math.PI / 180);
    pinta(frame.x, frame.y, frame.w, frame.h, -29, 28, 25, 25, 'prota');
    ctx.rotate(90 * Math.PI / 180);
    //barra de vida
    ctx.strokeStyle = '#f23';
    ctx.strokeRect(55, 10, 135, 10)
    ctx.fillStyle = '#d23';
        ctx.fillRect(56, 11, V.prota.vida, 8)
        ctx.restore();
    }
       
    function frameNave(){
        var frame;
        if (ac.avanza && ac.giraD){            frame = C.imgSet.prota.giraD;    }
        else if (ac.avanza && ac.giraI){    frame = C.imgSet.prota.giraI;    }
        else if (ac.avanza) {                frame = C.imgSet.prota.avanza;    }
        else {                                frame = C.imgSet.prota.quieto;    }
        return frame;
    }