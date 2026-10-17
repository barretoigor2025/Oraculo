import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGroqFetch } from '../../public/MindRolePlay/groq.js';
const response=(body,status=200)=>new Response(JSON.stringify(body),{status});
const opts={headers:{Authorization:'Bearer test-only'},body:JSON.stringify({model:'llama-3.3-70b-versatile',messages:[],max_tokens:200})};
test('Groq selects an available text model, retries inaccessible model and remembers working model',async()=>{
 const calls=[];const request=createGroqFetch(async(url,options)=>{
  if(url.endsWith('/models'))return response({data:[{id:'openai/gpt-oss-120b'},{id:'openai/gpt-oss-20b'}]});
  const body=JSON.parse(options.body);calls.push(body);
  return body.model.endsWith('120b')?response({error:{code:'model_not_found'}},404):response({choices:[{message:{content:'Sou Akiho.'}}]});
 });
 assert.equal((await request('chat',opts)).status,200);
 await request('chat',opts);
 assert.deepEqual(calls.map(x=>x.model),['openai/gpt-oss-120b','openai/gpt-oss-20b','openai/gpt-oss-20b']);
 assert.equal(calls[0].reasoning_effort,'low');assert.ok(calls[0].max_tokens>=1200);
});
test('Groq does not retry quota errors or replace invalid credentials',async()=>{
 let count=0;const request=createGroqFetch(async(url)=>{
  if(url.endsWith('/models'))return response({data:[{id:'openai/gpt-oss-120b'},{id:'openai/gpt-oss-20b'}]});
  count++;return response({error:{message:'Quota exceeded'}},429);
 });
 assert.equal((await request('chat',opts)).status,429);assert.equal(count,1);
 const invalid=createGroqFetch(async()=>response({error:{message:'Invalid key'}},401));
 assert.equal((await invalid('chat',opts)).status,401);
});
