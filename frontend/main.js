/* libreria 
https://svgjs.com
 */
//Area di disegno SVG
var canvas = SVG('drawing').size('100%', '100%').viewbox(100, 60,1100,400);
var gradiImpostati=0;
var ultimaPosizioneLancetta=0;
var direzioneTreno='AVANTI';//di default AVANTI
var frenoEmergenza=false;
/* Titolo sopra il cruscotto */
var titolo = canvas.text('Carrammateddu i me cucinu');
titolo.move(210,60).font({ fill: 'orange', family: 'verdana' });


