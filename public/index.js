

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var V = {
    prota:    		undefined,
    pantalla: 		undefined,
    universo: 		undefined,
    balas:   		[],
    otros:    		[],
    explos:   		[],
    desplaEstrella: 0
}

var ObjetoEspacial = function(x, y, t, v){
	this.x = x;
	this.y = y;
	this.theta = t;
	this.vel = v;
}
var Acciones = function(){
	this.pisandoAce = false,
	this.giraD = false,
	this.giraI = false,
	this.dispara = false
}

var Bala = function(objEsp){
    this.o = objEsp
    this.tipo = c;
}
var Explo = function(objEsp){
    this.o = objEsp;
    this.frame = 1;
    this.tics = C.tics.frame.explo;
}
var Nave = function(objEsp){
    this.objEsp = objEsp;
    this.bang;
    this.recarga;
    this.dirInercia;
    this.vida;
    this.tocada = 0;
    this.accion = new Acciones();
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
  //    DINAMICA DE JUEGO                                           //////////
 ////////////////////////////////////////////////////////////////////////////
//
 function juega(){
     if (prota.vida > 0){
         if (!ac.pausa){
             mueveNave();
//             //masMalos();
//             mueveMalos();
//             masBalas();
//             mueveBalas();
//             explota();
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
