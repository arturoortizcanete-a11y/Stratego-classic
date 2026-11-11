
import './style.css';

const app=document.querySelector('#app');
const counts=[['Mariscal',1,10],['General',1,9],['Coronel',2,8],['Mayor',3,7],['Capitán',4,6],['Teniente',4,5],['Sargento',4,4],['Minador',5,3],['Explorador',8,2],['Espía',1,1],['Bomba',6,-1],['Bandera',1,-2]];
const rankName=r=>counts.find(x=>x[2]===r)?.[0]||'';
const symbol=r=>r===-1?'✹':r===-2?'⚑':String(r);
const lake=(r,c)=>(r===4||r===5)&&(c===2||c===3||c===6||c===7);
let board=[], turn='blue', selected=null, setupSelected=null, phase='setup', setupSide='blue', setupPool=[], message='Colocá tus 40 piezas en tus cuatro filas de despliegue.', history=[], gameOver=false;
const colors={blue:'Azul',red:'Rojo'};
function army(side){const a=[];for(const [name,n,rank] of counts)for(let i=0;i<n;i++)a.push({side,rank,name,id:side+'-'+rank+'-'+i});return a;}
function shuffle(a){for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function newBoard(){board=Array.from({length:10},()=>Array(10).fill(null));}
function setupStart(){newBoard();setupSide='blue';setupSelected=null;setupPool=shuffle(army('blue'));phase='setup';turn='blue';selected=null;history=[];gameOver=false;message='Azul: colocá tus 40 piezas en las filas 7 a 10.';render();}
function randomPlace(side){const rows=side==='blue'?[6,7,8,9]:[0,1,2,3];const cells=[];rows.forEach(r=>{for(let c=0;c<10;c++)cells.push([r,c])});shuffle(cells);const pieces=shuffle(army(side));pieces.forEach((p,i)=>{const [r,c]=cells[i];board[r][c]=p;});}
function autoSetup(){newBoard();randomPlace('red');randomPlace('blue');phase='handoff';turn='blue';selected=null;message='Ejércitos desplegados al azar. Comienza Azul.';render();}
function setupClick(r,c){if(lake(r,c))return;if(setupSide==='blue'&&(r<6)||setupSide==='red'&&(r>3))return;const p=board[r][c];if(p&&p.side===setupSide){setupPool.push(p);board[r][c]=null;setupSelected=null;render();return;}if(!p&&setupSelected){const idx=setupPool.findIndex(x=>x.id===setupSelected);if(idx>=0){board[r][c]=setupPool.splice(idx,1)[0];setupSelected=null;render();}}}
function finishSetup(){if(setupPool.length){message=`Todavía quedan ${setupPool.length} piezas por colocar.`;render();return;}if(setupSide==='blue'){setupSide='red';setupPool=shuffle(army('red'));message='Pasá el dispositivo al jugador Rojo. Colocá sus 40 piezas en las filas 1 a 4.';}else{phase='handoff';turn='blue';message='Ejércitos listos. Pasá el dispositivo al jugador Azul.';}render();}
function beginTurn(){phase='play';selected=null;message=`Turno de ${colors[turn]}. Elegí una de tus piezas.`;render();}
function isMovable(p){return p&&p.rank>0;}
function legalMoves(r,c){const p=board[r][c];if(!p||p.side!==turn||!isMovable(p))return[];const dirs=[[1,0],[-1,0],[0,1],[0,-1]],out=[];for(const [dr,dc] of dirs){let nr=r+dr,nc=c+dc,steps=0;while(nr>=0&&nr<10&&nc>=0&&nc<10&&!lake(nr,nc)){const q=board[nr][nc];if(q){if(q.side!==turn)out.push([nr,nc]);break;}out.push([nr,nc]);steps++;if(p.rank!==2)break;nr+=dr;nc+=dc;if(steps>=9)break;}}return out;}
function combat(attacker,defender){if(defender.rank===-1)return attacker.rank===3?'attacker':'defender';if(defender.rank===-2)return'attacker';if(attacker.rank===-1||attacker.rank===-2)return'defender';if(attacker.rank===1&&defender.rank===10)return'attacker';if(attacker.rank>defender.rank)return'attacker';if(attacker.rank<defender.rank)return'defender';return'draw';}
function move(from,to){const [r,c]=from,[nr,nc]=to,p=board[r][c],q=board[nr][nc];if(!q){board[nr][nc]=p;board[r][c]=null;message=`${colors[turn]} movió una pieza.`;}else{const result=combat(p,q);if(result==='attacker'){board[nr][nc]=p;board[r][c]=null;message='¡Victoria en el combate!';}else if(result==='defender'){board[r][c]=null;message='La pieza defensora resistió el ataque.';}else{board[r][c]=null;board[nr][nc]=null;message='Empate: ambas piezas fueron retiradas.';}if(q.rank===-2&&result==='attacker'){gameOver=true;message=`¡${colors[turn]} capturó la bandera y ganó la partida!`;}}
history.push({turn,from,to});selected=null;if(!gameOver){turn=turn==='blue'?'red':'blue';phase='handoff';}render();}
function boardClick(r,c){if(phase==='setup'){setupClick(r,c);return;}if(phase!=='play'||gameOver)return;if(selected){const moves=legalMoves(...selected);if(moves.some(([a,b])=>a===r&&b===c)){move(selected,[r,c]);return;}}const p=board[r][c];if(p&&p.side===turn){selected=[r,c];message=`${rankName(p.rank)} seleccionada. Elegí una casilla resaltada.`;}else{selected=null;message='Seleccioná una de tus piezas.';}render();}
function render(){
app.innerHTML=`<header><div class="brand"><span class="sigil">S</span><div><b>STRATEGO</b><small>CLASSIC · 0.2</small></div></div><span class="pill">${phase==='setup'?'DESPLIEGUE':phase==='handoff'?'PRIVADO':'PARTIDA'}</span></header>
<main><section class="heading"><p class="eyebrow">ESTRATEGIA · DEDUCCIÓN</p><h1>${phase==='setup'?'Prepará tu ejército':'El campo de batalla'}</h1><p class="lead">${message}</p></section>
${phase==='setup'?`<section class="setupbar"><div><b>${colors[setupSide]}</b><span>${setupPool.length} piezas por colocar</span></div><button id="random">Colocar al azar</button><button class="primary" id="finish">${setupSide==='blue'?'Terminar Azul':'Terminar Rojo'}</button></section>`:''}
${phase==='handoff'?`<section class="handoff"><h2>Pasá el dispositivo</h2><p>Entregá el celular a ${colors[turn]}. Tocá continuar cuando esté listo.</p><button class="primary" id="continue">Continuar</button></section>`:''}
<section class="gamepanel"><div class="board" id="board"></div><div class="legend"><span><i class="dot blue"></i> Azul</span><span><i class="dot red"></i> Rojo</span><span><i class="dot lake"></i> Lagos</span></div></section>
${phase==='setup'?`<section class="pool"><h3>Fichas restantes · ${colors[setupSide]}</h3><div class="pieces">${setupPool.map(p=>`<button class="piece-token ${p.side} ${setupSelected===p.id?'chosen':''}" data-piece="${p.id}" title="${p.name}">${symbol(p.rank)}</button>`).join('')}</div><small>Tocá una ficha del tablero para devolverla a la reserva. Colocá las piezas en tus cuatro filas.</small></section>`:`<section class="controls"><div><span class="eyebrow">TURNO</span><b class="${turn}">${colors[turn]}</b></div><div><span class="eyebrow">MOVIMIENTOS</span><b>${history.length}</b></div><button id="newgame">Nueva partida</button></section>`}
<footer>PROTOTIPO DE REGLAS · MULTIJUGADOR TODAVÍA NO IMPLEMENTADO</footer></main>`;
const el=document.querySelector('#board');
for(let r=0;r<10;r++)for(let c=0;c<10;c++){const cell=document.createElement('button');cell.className='cell';if(lake(r,c))cell.classList.add('lake');if(selected&&legalMoves(...selected).some(([a,b])=>a===r&&b===c))cell.classList.add('valid');const p=board[r][c];if(p){const visible=phase==='setup'?p.side===setupSide:(phase==='handoff'?false:p.side===turn);cell.classList.add(p.side);cell.innerHTML=visible?`<span>${symbol(p.rank)}</span>`:'<span>•</span>';cell.title=visible?p.name:'Pieza rival';if(p.rank<0)cell.classList.add('special');}cell.addEventListener('click',()=>boardClick(r,c));el.append(cell);}
document.querySelector('#random')?.addEventListener('click',()=>{const rows=setupSide==='blue'?[6,7,8,9]:[0,1,2,3];const empty=[];rows.forEach(r=>{for(let c=0;c<10;c++)if(!lake(r,c)&&!board[r][c])empty.push([r,c]);});shuffle(empty);while(setupPool.length&&empty.length){const [r,c]=empty.pop();board[r][c]=setupPool.pop();}render();});
document.querySelector('#finish')?.addEventListener('click',finishSetup);
document.querySelectorAll('[data-piece]').forEach(btn=>btn.addEventListener('click',()=>{setupSelected=btn.dataset.piece;message=`Ficha seleccionada: ${setupPool.find(p=>p.id===setupSelected)?.name}. Elegí una casilla vacía.`;render();}));
document.querySelector('#newgame')?.addEventListener('click',setupStart);
document.querySelector('#continue')?.addEventListener('click',beginTurn);
}
setupStart();
