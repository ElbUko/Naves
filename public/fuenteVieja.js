
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth-4;
    canvas.height = window.innerHeight-4;
    var ctx = canvas.getContext("2d");
    var ac = {
        avanza:     false,
        giraD:      false,
        giraI:      false,
        dispara:    false,
        pausa:      false
    }
    var V = {
        prota:    undefined,
        panta:    undefined,
        unive:    undefined,
        balas:    [],
        malos:    [],
        explos:    [],
        desplaEstrella: 0,
        ticsNuevoMalo:    0,
        debug : { caminoSalida : []}
    }
    var imgSet;
    var C = {
        config : {
            pintaRejilla :     false,
            muestraCamino:     true,
            conImagen:          true},
        dims : {
            cw :     canvas.width,
            ch :     canvas.height,
            margenNavePant: 0.2 * Math.min(canvas.width,canvas.height),        //distancia al borde que puede acercarse la nave prota
            lejaniaMalo:    1000,        //distancia a la que la nave enemiga desaparece
            desapBala :     300,        //distancia a la que las balas desaparecen
            apaMalo :        300,           //distancia a la que aparecen las naves enemigas
            distFrenado :    10,            //distancia a la que frena el malo teniendo el muro delante
            fra: {                        //tamaños de los frames
                prota:        50,                
                malo:        50,
                fondo:        500,
                efDis:        10,
                balaProta:    5},
            cuadroInfo: {                    //cuadro de info (vida etc)
                w :         200,        
                h :         25}
            },                    
        ids : {
            balas : {
                prota:        'balaProta',
                malo:        'balaMalo'}},                
        ini : {
            posPantX:        2150,
            posPantY:        2450,
            posProtX:        2850,
            posProtY:        2950},
        vels : {
            prota:            10,
            protaGiro:        6,
            malo:            8,
            maloGiroMax:    3,
            protRecarga:    5,
            balaProta:        15,
            balaMalo:        15},
        tics : {
            nuMaloMin :     100,
            nuMaloFreqA :     100,
            nuMaloFreqB :     40,
            maloRecarga :     25,
            protaDesliz :     0.98,        // % de decrecimiento de velocidad en nave prota 0.97 poco 0.98 mucho
            balasAMalo :     2,
            calculaRuta :     25
        },
        imgSet : {
            prota :{
                quieto    :    {x:    0,    y:    0,    w:    50,    h:    50},
                avanza    :    {x:    50,    y:    0,    w:    50,    h:    50},
                giraI    :    {x:    100,y:    0,    w:    50,    h:    50},
                giraD    :    {x:    150,y:    0,    w:    50,    h:    50}},
            fondo    :        {x:    0,    y:    50,    w:    500,h:    500},
            malo1    :        {x:    200,y:    0,    w:    50,    h:    50},
            efDisp    :        {x:    250,y:    0,    w:    10,    h:    10},
            balaMalo:        {x:    250,y:    15,    w:    10,    h:    5},
            balaProta:        {x:    250,y:    10,    w:    5,    h:    5},
            mete1    :        {x:    550,y:    0,    w:    50,    h:    50},
            exp : {
                e1:         {x:    300,y:    0,    w:    50,    h:    50},
                e2:         {x:    350,y:    0,    w:    50,    h:    50},
                e3:         {x:    400,y:    0,    w:    50,    h:    50},
                e4:         {x:    450,y:    0,    w:    50,    h:    50},
                e5:         {x:    500,y:    0,    w:    50,    h:    50}},
            muro : {
                h1 :        {x:    600,y:    50,    w:    100,h:    100},
                h2 :        {x:    600,y:    250,w:    100,h:    100},
                v1 :        {x:    700,y:    150,w:    100,h:    100},
                v2 :        {x:    500,y:    150,w:    100,h:    100},
                no :        {x:    500,y:    50,    w:    100,h:    100},
                ne :        {x:    700,y:    50,    w:    100,h:    100},
                so :        {x:    500,y:    250,w:    100,h:    100},
                se :        {x:    700,y:    250,w:    100,h:    100},
                t :            {x:    500,y:    50,    w:    300,h:    300}
            }
        }
    }
    var mundos = {
        mundos : [[1,1, , ,1,1],
                  [ , , , , , ],
                  [ , , ,1, , ],
                  [ ,2,1, , , ],
                  [ , , , , , ]],
        mundoLen : 2000,
        piezaLen : 100,
        mapaLenX :    20,
        mapaLenY :    20,
        mapas : {
            0: 0,                        
            1: [[ , , , , , , , , , , , , , , , , , , , , ],
                [ , , , , , , , , , , , , , , , , , , , , ],
                [ , , , , , , , , , , , , , , , , , , , , ],
                [ , , , , , , , , , , , , , , , , , , , , ],
                [ , , , ,8,1,1,1,1,1,1,1,1,1,5, , , , , , ],
                [ , , , ,4, , , , , , , , , ,2, , , , , , ],
                [ , , , ,4, , , , , , , , , ,2, , , , , , ],
                [ , , , ,4, , , , , , , , , ,7,1,1,5, , , ],
                [ , , , ,4, , , , , , , , , , , , ,2, , , ],
                [ , , , ,4, , , , , , , , , , , , , , , , ],
                [ , , , ,4, , , , , , , , , , , , , , , , ],
                [ , , , ,4, , , , , , , , , ,8,3,3,3,6, , ],
                [ , , , ,4, , , , , , , , , ,2, , , , , , ],
                [ , , , ,4, , , , , , , , , ,2, , , , , , ],
                [ , , , ,4, , , , , , , ,3,3,6, , , , , , ],
                [ , , , ,4, , , , , , , , , , , , , , , , ],
                [ , , , ,7,3,3,3,3, , , , , , , , , , , , ],
                [ , , , , , , , , , , , , , , , , , , , , ],
                [ , , , , , , , , , , , , , , , , , , , , ],
                [ , , , , , , , , , , , , , , , , , , , , ]
                                                            ],
            2: [[ , , , , , , , , , , , , , , , , , , , , ],
                [ , , , , , , , , , , , , , , , , , , , , ],
                [ , ,8,1,1,1,1,1,1,1,1,1,1,1, , , , ,2, , ],
                [ , , , , , , , , , , , , , , , , , ,2, , ],
                [ , , , ,8,1,1,1,1,1,1,1,1,1,5, , , ,2, , ],
                [ , , , ,4, , , , , , , , , ,2, , , ,2, , ],
                [ , , , ,4, , , , , , , , , ,2, , , ,2, , ],
                [ , , , ,4, , , , ,1,1,5, , ,7,1,1,5,2, , ],
                [ , , , ,4, , , , , , ,2, , , , , ,2, , , ],
                [ , , , ,4, , ,4, , , ,2, , , , , , , , , ],
                [ , , , ,4, , ,4, , , ,2, , , , , , , , , ],
                [ , , , ,4, , ,4, , , ,2, , ,8,3, , ,6, , ],
                [ , , , ,4, , ,7,3,3,3,6, , ,2, , , ,2, , ],
                [ , , , ,4, , , , , , , , , ,2, , , ,2, , ],
                [ , , , ,4, , , , , , , ,3,3,6, , , ,2, , ],
                [ , , , ,4, , , , , , , , , , , , , ,2, , ],
                [ , ,4, ,7,3,3,3,3, , , , , , , , , ,2, , ],
                [ , ,4, , , , , , , , , , , , , , , ,2, , ],
                [ , ,4, , , ,3,3,3,3,3,3,3,3,3,3,3,3,6, , ],
                [ , , , , , , , , , , , , , , , , , , , , ]]},
        piezas : {
            1 : 'h1',
            2 : 'v1',
            3 : 'h2',
            4 : 'v2',
            5 : 'ne',
            6 : 'se',
            7 : 'so',
            8 : 'no'                    
            }
        }

   ////////////////////////////////////////////////////////////////////////////
  //    MODELO                                                        //////////
 ////////////////////////////////////////////////////////////////////////////
//
    //Todos los elementos los 'pincho' a la tabla global que es el universo.
    //XY de todo (incluido pantalla) referente a la esq sup de uni
        var Bala = function(x,y,t,c){
            this.x = x;
            this.y = y;
            this.theta = t;
            this.tipo = c;
        }
        var Explo = function(x,y,t){
            this.x = x;
            this.y = y;
            this.theta = t;
            this.frame = 1;
            this.tics = 3;
        }
        var Nave = function(){
            this.x;
            this.y;
            this.vel;
            this.theta;
            this.mundo = [],
            this.casilla = [],
            this.bang;
            this.recarga;
            this.enfilada;
            this.tocada = 0;
        }
        var Pantalla = function(){
            this.x;
            this.y;
            this.w;
            this.h;
        }
        var Universo = function(){
            this.w;
            this.h;
        }
           

   ////////////////////////////////////////////////////////////////////////////
  //    MOTOR LOGICO                                                //////////
 ////////////////////////////////////////////////////////////////////////////
//
    function mueveNave(){
        //Dinamica de aceleracion o freno
        if (ac.avanza && V.prota.vel<C.vels.prota){
            V.prota.vel += 1;
        }
        if (!ac.avanza && V.prota.vel!=0){
            V.prota.vel = ((V.prota.vel<1)?0:(V.prota.vel*C.tics.protaDesliz));
        }
           
        //giro
        var dx = 0, dy;
        if (ac.giraD) dx = 1;
        if (ac.giraI) dx = -1;
        V.prota.theta += (dx * ((V.prota.vel > 0) ? C.vels.protaGiro : 1));
        if (V.prota.theta<0) V.prota.theta += 360;
        if (V.prota.theta>=360) V.prota.theta -= 360;

        //avance
        if (ac.avanza) V.prota.inercia = V.prota.theta;
        dx = Math.floor(Math.cos(V.prota.inercia * Math.PI / 180) * V.prota.vel);
        dy = Math.floor(Math.sin(V.prota.inercia * Math.PI / 180) * V.prota.vel);
           
        //Collider nave
        var mx1 = Math.floor((V.prota.x+mundos.piezaLen/2) / mundos.mundoLen);
        var my1 = Math.floor((V.prota.y+mundos.piezaLen/2) / mundos.mundoLen);
        var px1 = Math.floor(((V.prota.x+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen);
        var py1 = Math.floor(((V.prota.y+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen);
        var mx2 = Math.floor((V.prota.x+dx+mundos.piezaLen/2) / mundos.mundoLen);
        var my2 = Math.floor((V.prota.y+dy+mundos.piezaLen/2) / mundos.mundoLen);
        var px2 = Math.floor(((V.prota.x+dx+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen);
        var py2 = Math.floor(((V.prota.y+dy+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen);
           
        var colision = (mundos.mundos[my2] != undefined
                    && mundos.mundos[my2][mx2] != undefined
                    && mundos.mapas[mundos.mundos[my2][mx2]][py2][px2] != undefined);
           
        if (colision){
            dx = 0;
            dy = 0;
            V.prota.vel = 0;
            V.prota.inercia = 0;
            V.prota.mundo = [mx1,my1];
            V.prota.casilla = [px1,py1];
        } else {        
            V.prota.mundo = [mx2,my2];
            V.prota.casilla = [px2,py2];
        }
        //avanzo nave
        V.prota.x += dx;
        V.prota.y += dy;
           
        //Si nave quiere salir de pantalla la muevo
        if ((V.prota.x - V.panta.x <= C.dims.margenNavePant)
          || ((V.panta.x + V.panta.w) - V.prota.x <= C.dims.margenNavePant)){
            V.panta.x += dx;
        }
        if ((V.prota.y - V.panta.y <= C.dims.margenNavePant)
          || ((V.panta.y + V.panta.h) - V.prota.y <= C.dims.margenNavePant)){
            V.panta.y += dy;
        }
    }
       
    function masBalas(){
        //Si malo ha disparado se añade bala
        for (var i=0; i<V.malos.length; i++){
            if (V.malos[i].bang){
                var bala = new Bala(V.malos[i].x + Math.cos(V.malos[i].theta * Math.PI / 180),
                                V.malos[i].y + Math.sin(V.malos[i].theta * Math.PI / 180),
                                V.malos[i].theta, C.ids.balas.malo);
                V.balas.push(bala);
                V.malos[i].bang = false;
            }
        }
        //Si prota ha disparado añadimos bala
        if (ac.dispara && V.prota.recarga >= C.vels.protRecarga){
            var bala = new Bala(V.prota.x + Math.cos(V.prota.theta * Math.PI / 180),
                                V.prota.y + Math.sin(V.prota.theta * Math.PI / 180),
                                V.prota.theta, C.ids.balas.prota);
            V.balas.push(bala);
            V.prota.recarga -= 1;
        }
        //actualizamos el timer de disparo del prota
        if (V.prota.recarga < C.vels.protRecarga){
            V.prota.recarga = (V.prota.recarga<0) ? C.vels.protRecarga : V.prota.recarga-1;
        }
    }
       
    function mueveBalas(){
        for (var i=V.balas.length-1; i>=0; i--){
            var bala = V.balas[i];
            bala.x += Math.floor(Math.cos(bala.theta * Math.PI / 180) * C.vels[bala.tipo]);
            bala.y += Math.floor(Math.sin(bala.theta * Math.PI / 180) * C.vels[bala.tipo]);
               
            //Si bala se sale de marco (+ cierta dist) la quitamos
            if (bala.x < V.panta.x-C.dims.desapBala || bala.x > V.panta.x + V.panta.w + C.dims.desapBala
              || bala.y < V.panta.y-C.dims.desapBala || bala.y > V.panta.y + V.panta.h + C.dims.desapBala){
                V.balas.splice(i,1);
            }
            //vemos si choca para quitarla
            collidaBala(bala, i);
        }
    }
       
    function collidaBala(bala, i){
        var dp = C.dims.fra.prota/2;
        var dm = C.dims.fra.malo/2;
        //miro si mata a prota
        if (bala.x > (V.prota.x - dp)  &&  bala.x < (V.prota.x + dp)
          && bala.y > (V.prota.y - dp)  &&  bala.y < (V.prota.y + dp)
          && bala.tipo != C.ids.balas.prota){
            cargaExplo(i, V.prota);
            V.prota.vida -= 5;
        }
        //miro si mata a malo
        for (var j=V.malos.length-1; j>=0; j--){
            var malo = V.malos[j];
            if (bala.x > (malo.x - dm)  &&  bala.x < (malo.x + dm)
              && bala.y > (malo.y - dm)  &&  bala.y < (malo.y + dm)
              && bala.tipo == C.ids.balas.prota){
                cargaExplo(i, malo);
                malo.tocada += 1;
            }
        }
        //miro si choca pared
        var mundoX = Math.floor((bala.x+mundos.piezaLen/2) / mundos.mundoLen);
        var mundoY = Math.floor((bala.y+mundos.piezaLen/2) / mundos.mundoLen);
        var piezaX = Math.floor(((bala.x+mundos.piezaLen/2) % mundos.mundoLen) / mundos.piezaLen);
        var piezaY = Math.floor(((bala.y+mundos.piezaLen/2) % mundos.mundoLen) / mundos.piezaLen);
        if (mundos.mundos[mundoY] != undefined && mundos.mundos[mundoY][mundoX] != undefined){
            if(mundos.mapas[mundos.mundos[mundoY][mundoX]][piezaY][piezaX] != undefined){
                V.balas.splice(i,1);
            }
        }
    }
       
    function cargaExplo(balaI, nave){
        var bala = V.balas[balaI];
        var dx = nave.x - bala.x;
        if (dx == 0) dx = 0.000001;
        var theta = Math.atan(nave.y - bala.y / dx) * 180 / Math.PI;
        if (dx < 0) theta += 180;
        V.explos.push(new Explo(nave.x, nave.y, theta));
        V.balas.splice(balaI,1);
    }
       
    function masMalos(){
        //Se añaden malos aleatoriamente
        //if (V.ticsNuevoMalo > 0) V.ticsNuevoMalo -= 1;
        //if (V.ticsNuevoMalo == 0
          //&& Math.random() * C.tics.nuMaloFreqA < C.tics.nuMaloFreqB){
        if (V.malos.length < 1){
            var n = V.malos.length;
            V.malos.push(new Nave());
            V.malos[n].theta = Math.random() * 360;
            V.malos[n].vel = C.vels.malo;
            V.malos[n].recarga = C.tics.maloRecarga;
            if (V.prota.theta < 90) {
                V.malos[n].x = V.panta.x + V.panta.w + 200;
                V.malos[n].y = V.panta.y + V.panta.h + 200;
            } else if (V.prota.theta < 180) {    
                V.malos[n].x = V.panta.x - 200;
                V.malos[n].y = V.panta.y + V.panta.h + 200;
            } else if (V.prota.theta < 270) {
                V.malos[n].x = V.panta.x - 200;
                V.malos[n].y = V.panta.y - 200;
            } else {
                V.malos[n].x = V.panta.x + V.panta.w + 200;
                V.malos[n].y = V.panta.y - 200;
            }
            V.malos[n].mundo = [Math.floor((V.malos[n].x+mundos.piezaLen/2) / mundos.mundoLen),
                                Math.floor((V.malos[n].y+mundos.piezaLen/2) / mundos.mundoLen)];
            V.malos[n].casilla = [Math.floor(((V.malos[n].x+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen),
                                  Math.floor(((V.malos[n].y+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen)];
            V.ticsNuevoMalo = C.tics.nuMaloMin;
        }
    }
       
    function mueveMalos(){
        for (var i=V.malos.length-1; i>=0; i--){
            var nave = V.malos[i];
            //Si la nave se ha alejado mucho la quitamos
            if (nave.x < V.panta.x - canvas.width || nave.x > V.panta.x + V.panta.w + canvas.width
              || nave.y < V.panta.y - canvas.height || nave.y > V.panta.y + V.panta.h + C.dims.lejaniaMalo){
                V.malos.splice(i,1);
            }
            //Si ha recibido suficientes balazos la quitamos, si no movemos
            if (nave.tocada >= C.tics.balasAMalo){
                V.malos.splice(i,1);
            } else {                    
                //se llama a IA. Si vuelo libre da [x,y] de prota, si no de prox casilla.
                var objetivo = vueloLibre(nave)
                            ?[V.prota.x, V.prota.y]
                            :xyObjetivo(nave);
                //se calcula giro:
                var dx = objetivo[0] - nave.x;
                var dy = objetivo[1] - nave.y;
                if (dx == 0) dx = 0.000001;
                var angProta = Math.atan(dy/dx) * 180 / Math.PI;

                if (dx<0) angProta += 180;   //La tangente es simetrica
                if (angProta<0) angProta += 360;

                var dt = (angProta - nave.theta);
                var sig = Math.sign(dt)
                if (Math.abs(dt) > C.vels.maloGiroMax){
                    nave.theta += ((Math.abs(dt)>180)?-sig:sig) * C.vels.maloGiroMax;
                    nave.enfilada = false;
                } else {
                    nave.theta += dt;
                    nave.enfilada = true;
                }
                if (nave.theta<0)         nave.theta += 360;
                if (nave.theta>=360)     nave.theta -= 360;
                   
                dx = Math.floor(Math.cos(nave.theta * Math.PI / 180) * nave.vel);
                dy = Math.floor(Math.sin(nave.theta * Math.PI / 180) * nave.vel);

                var factorVel = 1;
                //calcula que velocidad quiere
                if (esMuro(nave.x+C.dims.distFrenado*dx, nave.y+C.dims.distFrenado*dy)){ //a distancia de 2 avances iguales
                    factorVel = 0.2;
                }
                if (esMuro(nave.x+C.dims.distFrenado*2*dx, nave.y+C.dims.distFrenado*2*dy)){ //a distancia de 2 avances iguales
                    factorVel = 0.5;
                }
                if (esMuro(nave.x+C.dims.distFrenado*4*dx, nave.y+C.dims.distFrenado*4*dy)){ //a distancia de 3 avances iguales
                    factorVel *= 0.75;
                }
                dx = Math.floor(Math.cos(nave.theta * Math.PI / 180) * nave.vel * factorVel);
                dy = Math.floor(Math.sin(nave.theta * Math.PI / 180) * nave.vel * factorVel);
                    /*dx = Math.floor(Math.cos(nave.theta * Math.PI / 180) * nave.vel/2);
                    dy = Math.floor(Math.sin(nave.theta * Math.PI / 180) * nave.vel/2);
                    if (esMuro(nave.x+dx, nave.y+dy)){
                        dx = Math.floor(Math.cos(nave.theta * Math.PI / 180) * nave.vel/4);
                        dy = Math.floor(Math.sin(nave.theta * Math.PI / 180) * nave.vel/4);
                        if (esMuro(nave.x+dx, nave.y+dy)){
                            dx= 0;
                            dy= 0;
                        }
                    }
                }*/
        //        var factorV = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2)) / mundos.piezaLen;
        //        nave.vel = (factorV < 5 && factorV > 1.5)? C.vels.malo*factorV/5 : C.vels.malo;
        //        console.log(nave.vel)
                   
                   
                nave.x +=    dx;
                nave.y +=     dy;
                   
                //Si tiene a prota enfilado dispara
                    if (nave.enfilada){
                        if (nave.recarga == C.tics.maloRecarga){
                            nave.bang = true;
                            nave.recarga -= 1;
                        } else if (nave.recarga < 0){
                            nave.recarga = C.tics.maloRecarga;
                        } else {
                            nave.recarga -= 1;
                        }
                    }
                }
            }
        }
           
        function explota(){
            for (var i=V.explos.length-1; i>=0; i--){
                if (V.explos[i].frame < 5){
                    V.explos[i].tics -=1;
                    if (V.explos[i].tics<0){
                        V.explos[i].tics = 3;
                        V.explos[i].frame +=1;
                    }
                } else {
                    V.explos.splice(i,1);
                }
            }
        }
           
           
   ////////////////////////////////////////////////////////////////////////////
  //    Utiles Maths                                                    //////////
 ////////////////////////////////////////////////////////////////////////////
//        
    function esMuro(x,y){
        var mundo = dameMundo(x,y);
        var pieza = damePieza(x,y);
        return mundos.mundos[mundo.y] != undefined
            && mundos.mundos[mundo.y][mundo.x] != undefined
            && mundos.mapas[mundos.mundos[mundo.y][mundo.x]][pieza.y] != undefined
            && mundos.mapas[mundos.mundos[mundo.y][mundo.x]][pieza.y][pieza.x] != undefined;
    }
    function dameMundo(x,y){
        var mx2 = Math.floor(( x + mundos.piezaLen/2) / mundos.mundoLen);
        var my2 = Math.floor(( y + mundos.piezaLen/2) / mundos.mundoLen);
        return {x: mx2, y: my2};
    }
    function damePieza(x,y){
        var px2 = Math.floor((( x + mundos.piezaLen / 2) % mundos.mundoLen)/mundos.piezaLen);
        var py2 = Math.floor((( y + mundos.piezaLen / 2) % mundos.mundoLen)/mundos.piezaLen);
        return {x: px2, y: py2};
    }
   
   ////////////////////////////////////////////////////////////////////////////
  //    IA MALOS                                                    //////////
 ////////////////////////////////////////////////////////////////////////////
//
/*    Los malos solo apareceran aleatoriamente en espacio libre.
 *  En laberinto apareceran solo en los puntos consignados.
 *  En espacio libre vuelan con normalidad
 *  En laberinto van avanzando por las casillas libres
 */
//Vamos a hacer un A* clasico y dejarnos de ostias.....
function xyObjetivo(nave){
    /* Este hace falta para las zonas con mapa de muros.
     * va a construir la rejilla y buscar el camino libre hasta el otro punto.
     * Solo va a ser un problema de malla y devuelve la primera casilla a la que ir
     * La malla(mapa) tendra 1 para muros (cualquiera) y 0 para meta (prota o esquina o lateral destino)
     * En caso de estar el prota en mundo libre,
     */
    //MODELO
    //de momento solo vamos a usar el mapà en el que esta el malo y prota juntos
    var mapa = mundos.mapas[mundos.mundos[nave.mundo[1]][nave.mundo[0]]];
    var meta;
    var Nodo = function(heuristica, pasos, estado, traza){
        this.h = heuristica;    //numerito que puntua la calidad del estado
        this.c = pasos;            //contador del coste que ha llevado llegar ahi
        this.e = estado;        //posicion xy en la malla
        this.traza = traza;        //historico de los estados anteriores
    }
    var Estado = function(x, y){
        this.x = x;
        this.y = y;
    }
       
    //Utiles de IA
    function calculaMeta(){
        var meta = V.prota.casilla;
        if ((nave.mundo[0] != V.prota.mundo[0]) || (nave.mundo[1] != V.prota.mundo[1])){
            var dx = (nave.mundo[0] < V.prota.mundo[0])
                ? mundos.mundoLen : (nave.mundo[0] > V.prota.mundo[0])
                    ? 0 : V.prota.casilla[0];
            var dy = (nave.mundo[1] < V.prota.mundo[1])
                ? mundos.mundoLen : (nave.mundo[1] > V.prota.mundo[1])
                    ? 0 : V.prota.casilla[1];
            meta = [dx, dy];
        }
        return meta;
    }
    function heuristica(estado){
        if (meta[0]==-1)
            return estado.y-meta[1];
        if (meta[1]==-1)
            return estado.y-meta[0];
        return Math.sqrt(Math.pow(estado.x-meta[0],2)+Math.pow(estado.y-meta[1],2));
    }
    function dameVecino(pt, i){
        switch (i){
            case 0: return new Estado(pt.x        , pt.y-1);
            case 1: return new Estado(pt.x+1    , pt.y     );
            case 2: return new Estado(pt.x        , pt.y+1);
            case 3: return new Estado(pt.x-1    , pt.y     );            
        }
    }
    function noVisitado(e){
        for (var i=0; i<visitados.length; i++){
            if (e.x == visitados[i].x && e.y == visitados[i].y){
                return false;
            }
        }
        return true;
    }
    function metenFrontera(nodo){
        if (frontera.length==0){
            frontera.push(nodo);
        } else {
            var insertado = false;
            for (var i=0; i<frontera.length; i++){
                if (frontera[i].h + frontera[i].c > nodo.h + nodo.c){
                    if (i==0){
                        frontera.unshift(nodo);
                    } else {
                        frontera = [].concat(frontera.slice(0,i), [nodo], frontera.slice(i));
                    }
                    insertado = true;
                    break;
                }
            }
            if (!insertado){
                frontera.push(nodo);
            }
        }
    }
    function sacaHijos(nodo){
        //Hacemos hasta 4 nodos posibles
        if (nodo != undefined){
            for (var i=0; i<4; i++){
                var e = dameVecino(nodo.e, i);
                var t = [].concat([e],nodo.traza);
                if (e.x>0 && e.y>0 && e.x<mapa[0].length && e.y < mapa.length
                  && mapa[e.y][e.x] == undefined && noVisitado(e)){
                    var n = new Nodo(heuristica(e), nodo.c+1, e, t);
                    visitados.push(e);
                    metenFrontera(n);
                }
            }
        }
    }
    function evaluaSol(nodo){
        //Si entre prota y nave hay espacio vacio -> vuelo libre
        if (nodo == undefined) return true;
        for (var j=Math.min(V.prota.casilla[1]-1, nodo.e.y); j<=Math.max(V.prota.casilla[1]+1, nodo.e.y); j++){
            for (var i=Math.min(V.prota.casilla[0]-1, nodo.e.x); i<=Math.max(V.prota.casilla[0]+1, nodo.e.x); i++){
                if (mapa != undefined || mapa[j] != undefined || mapa[j][i] != undefined){
                    return (nodo.h == 0);
                }
            }
        }
        return true;
    }
       
    //prepara meta
    meta = calculaMeta();
    //Sacamos el primer nodo
    var estadoIni = new Estado(Math.floor(((nave.x+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen),
                            Math.floor(((nave.y+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen));
    var h = heuristica(estadoIni);
    var nodo = new Nodo(h, 0, estadoIni, []);
    var frontera = [];
    frontera.push(nodo);
    var visitados = [];
    visitados.push(estadoIni);
       
    iter = 6000;
    var sol = false;
    while (!sol && iter>0){
        nodo = frontera.shift();
        sol = evaluaSol(nodo);
        sacaHijos(nodo);
        iter -= 1;
    }
       
    //Para minimizar el camino serpiente:
    //TODO (si va a la esquina, que vaya directamente si ambos lados son libres)
        if (nodo != undefined && nodo.traza.length>0)
            V.debug.caminoSalida = [nave.mundo[0], nave.mundo[1], nodo.traza]
        else
            V.debug.caminoSalida = []
        return (nodo != undefined && nodo.traza.length>2)
                ? [nave.mundo[0] * mundos.mundoLen + nodo.traza[nodo.traza.length-1].x * mundos.piezaLen,
                   nave.mundo[1] * mundos.mundoLen + nodo.traza[nodo.traza.length-1].y * mundos.piezaLen]
                : [V.prota.x, V.prota.y];
           
    }
       
   
   
       
    function vueloLibre(nave){
        //Es vuelo libre si
    // - El malo esta en cielo abierto
    //No sera si
    // - El malo esta en laberinto
    // - Estando en cielo abierto, el prota esta en laberinto contiguo
    var mundMaloX = Math.floor((nave.x+mundos.piezaLen/2) / mundos.mundoLen);
    var mundMaloY = Math.floor((nave.y+mundos.piezaLen/2) / mundos.mundoLen);
    var maloCieloAbierto = (mundos.mundos[mundMaloY] == undefined
                        || mundos.mundos[mundMaloY][mundMaloX] == undefined);
    var protaCieloAbierto = (mundos.mundos[V.prota.mundo[1]] == undefined
                        || mundos.mundos[V.prota.mundo[1]][V.prota.mundo[0]] == undefined );
    var distCuads = Math.max(Math.abs(mundMaloX-V.prota.mundo[0]),Math.abs(mundMaloY-V.prota.mundo[1]));
    nave.mundo = [mundMaloX, mundMaloY];
    return maloCieloAbierto
            /*&& (distCuads == 0
                || (distCuads == 1 && protaCieloAbierto)
                || distCuads > 1));
                */
    //return ((nave.mundo[0] != V.prota.mundo[0]) || (nave.mundo[1] != V.prota.mundo[1]))
    }
       
       
       
   ////////////////////////////////////////////////////////////////////////////
  //    MOTOR GRAFICO                                                //////////
 ////////////////////////////////////////////////////////////////////////////
//
    //He de pasar todas las distancias relativas al universo,
    //a relativas a la pantalla.
    function pintaEscenario(){
        //limpio
        ctx.clearRect(0,0,canvas.width,canvas.height);
           
        //pinto fondo
        V.desplaEstrella += 0.1;
        if (V.desplaEstrella > C.dims.fra.fondo) V.desplaEstrella -= C.dims.fra.fondo;
        var xDesde = 0-((V.panta.x-500 + V.desplaEstrella) % C.dims.fra.fondo);
        var xHasta = V.panta.w + C.dims.fra.fondo;
        var yDesde = 0-((V.panta.y-500 + V.desplaEstrella) % C.dims.fra.fondo);
        var yHasta = V.panta.h + C.dims.fra.fondo;
        var fondo = C.imgSet.fondo;
        if (xDesde>0) xDesde = xDesde-C.dims.fra.fondo;
        if (yDesde>0) yDesde = yDesde-C.dims.fra.fondo;                
        for (var i=xDesde; i<=xHasta; i+=C.dims.fra.fondo-1){
            for (var j=yDesde; j<=yHasta; j+=C.dims.fra.fondo-1){
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
           

   ////////////////////////////////////////////////////////////////////////////
  //    DINAMICA DE JUEGO                                            //////////
 ////////////////////////////////////////////////////////////////////////////
//
    function juega(){
        //Comprueba si no te han matao
            if (V.prota.vida > 0){
                if (!ac.pausa){
                    mueveNave();
                    //masMalos();
                    mueveMalos();
                    masBalas();
                    mueveBalas();
                    explota();
                    pintaEscenario();
                    pintaDinamicas();
                    pintaCuadroInfo();
                }
                requestAnimationFrame(juega);
            } else {
                cargaFin();
            }
        }
           
        function cargaFin(){
            inicializa();
        }
        function limpiaAcciones(){
            ac.dispara = false;
        }


   ////////////////////////////////////////////////////////////////////////////
  //    CONTROL TECLADO                                                //////////
 ////////////////////////////////////////////////////////////////////////////
//
    function aprietaTecla(event){
        var tec = event.keyCode;
        switch(tec){
            case 38: //arriba
                ac.avanza = true;
                break;
            case 39: //dcha
                ac.giraD = true;
                ac.giraI = false;
                break;
            case 40: //abajo
                break;
            case 37: //izq
                ac.giraD = false;
                ac.giraI = true;
                break;
            case 17: //barra
                ac.dispara = true;
                break;
            case 80: //P
                ac.pausa = !ac.pausa;
                break;
        }
    }
    function sueltaTecla(event){
        if (event.keyCode == 38){
            ac.avanza = false;
        } else if (event.keyCode == 39){
            ac.giraD = false;
        } else if (event.keyCode == 37){
            ac.giraI = false;
        } else if (event.keyCode == 17){
            ac.dispara = false;
        }
    }
    function ponControlTeclao(){
        document.addEventListener('keydown', aprietaTecla);
        document.addEventListener('keyup', sueltaTecla);
        }


   ////////////////////////////////////////////////////////////////////////////
  //    ARRANQUE Y CARGA DE IMAGENES                                //////////
 ////////////////////////////////////////////////////////////////////////////
//
    imgSet = new Image();
    imgSet.src = "imgset.png";
       
    //INICIO
    function inicializa(){
        ponControlTeclao();
        V.prota = new Nave();
        V.prota.x = C.ini.posProtX;
        V.prota.y = C.ini.posProtY;
        V.prota.mundo = [Math.floor((V.prota.x+mundos.piezaLen/2) / mundos.mundoLen),
                         Math.floor((V.prota.y+mundos.piezaLen/2) / mundos.mundoLen)];
        V.prota.casilla = [Math.floor(((V.prota.x+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen),
                           Math.floor(((V.prota.y+mundos.piezaLen/2) % mundos.mundoLen)/mundos.piezaLen)];
        V.prota.theta = 0;
        V.prota.vel = 0;
        V.prota.recarga = C.vels.protRecarga;
        // TODO - vida e inercia de prota hay que integrarlo en modelo nuevo quiza
            V.prota.vida = 133;
            V.prota.inercia = 0;
            V.panta = new Pantalla();
            V.panta.x = C.ini.posPantX;
            V.panta.y = C.ini.posPantY;
            V.panta.w = canvas.width;
            V.panta.h = canvas.height
            V.unive = new Universo();
            V.unive.w = V.panta.x * 2 + V.panta.w;
            V.unive.h = V.panta.h * 2 + V.panta.h;
            V.balas =         [];
            V.malos =         [];
            V.explos =         [];
            V.desplaEstrella = 0;
            V.ticsNuevoMalo = 0;
            ac.avanza =     false,
            ac.giraD =         false,
            ac.giraI =        false,
            ac.dispara =    false
            requestAnimationFrame(juega);
        }
        setTimeout(inicializa,10);
   