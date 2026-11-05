import test from 'node:test';
import assert from 'node:assert/strict';
import {project,resolveTest,initiative,hasCover} from '../demo-combate/rules.js';
test('scene perspective preserves stature at the same depth and shrinks distant actors',()=>{
 const tall=project({cm:200,depth:40}),short=project({cm:150,depth:40});
 assert.ok(Math.abs(tall.height/short.height-200/150)<1e-10);
 assert.ok(project({cm:200,depth:85}).height<project({cm:150,depth:5}).height);
 assert.ok(project({cm:182,depth:85}).feet<project({cm:182,depth:5}).feet);
});
test('initiative resolves equal speed by DX and keeps a stable final tie',()=>{
 assert.deepEqual(initiative([{id:'a',speed:6,dx:12,order:0},{id:'b',speed:6,dx:14,order:1},{id:'c',speed:6,dx:14,order:2},{id:'d',speed:6.5,dx:10,order:3}]),['d','b','c','a']);
});
test('the demo honors automatic critical results and validates three d6',()=>{
 assert.equal(resolveTest([1,1,1],7).criticalSuccess,true);
 assert.equal(resolveTest([6,6,6],20).success,false);
 assert.equal(resolveTest([6,6,6],20).criticalFailure,true);
 assert.throws(()=>resolveTest([7,1,1],12),TypeError);
});
test('cover is lost when an enemy reaches its unprotected side',()=>{
 const covers=[{id:'muro',x:288}];const player={x:260,cover:'muro'};
 assert.equal(hasCover(player,{x:610},covers),true);
 assert.equal(hasCover(player,{x:200},covers),false);
 assert.equal(hasCover({x:700,cover:'muro'},{x:900},covers),false);
});
