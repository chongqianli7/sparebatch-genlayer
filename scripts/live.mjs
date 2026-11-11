import {createClient,createAccount,generatePrivateKey} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import fs from 'node:fs';
import {example} from '../src/core.js';
fs.mkdirSync('.local',{recursive:true});
const secret='.local/test-key';if(!fs.existsSync(secret))fs.writeFileSync(secret,generatePrivateKey(),{mode:0o600});
const account=createAccount(fs.readFileSync(secret,'utf8').trim());
const client=createClient({chain:studionet,endpoint:'https://studio.genlayer.com/api',account});
const source=fs.readFileSync('contracts/sparebatch.py','utf8');
const action=process.argv[2]??'schema';
const save=(path,v)=>fs.writeFileSync(path,JSON.stringify(v,(_,v)=>typeof v==='bigint'?v.toString():v,2));
if(action==='schema'){console.log(JSON.stringify(await client.getContractSchemaForCode(source)));process.exit(0)}
let d=fs.existsSync('deployment.json')?JSON.parse(fs.readFileSync('deployment.json','utf8')):{owner:account.address.toLowerCase(),network:'Stable Studionet',chainId:61999,rpc:'https://studio.genlayer.com/api',records:[]};
if(action==='deploy'){if(d.deployHash)throw Error('Deployment already submitted');d.deployHash=await client.deployContract({code:source,args:[],leaderOnly:false});save('deployment.json',d);console.log(d.deployHash);process.exit(0)}
if(action==='receipt'){const hash=process.argv[3]??d.deployHash;const tx=await client.getTransaction({hash});save(`evidence/${hash}.json`,tx);console.log(JSON.stringify(tx,(_,v)=>typeof v==='bigint'?v.toString():v));process.exit(0)}
if(action==='configure'){d.address=process.argv[3];save('deployment.json',d);console.log(await client.readContract({address:d.address,functionName:'protocol',args:[]}));console.log('source matches',source===await client.getContractCode(d.address));process.exit(0)}
if(action==='read'){console.log(await client.readContract({address:d.address,functionName:'inspect',args:[d.owner,process.argv[3]??'textile-saturday']}));process.exit(0)}
if(action==='send'){const fn=process.argv[3];const args=JSON.parse(process.argv[4]);const hash=await client.writeContract({address:d.address,functionName:fn,args,value:0n,leaderOnly:false});d.records.push({hash,functionName:fn,args});save('deployment.json',d);console.log(hash);}
if(action==='example'){const name=process.argv[3]??'textile-saturday';const p=structuredClone(example);if(process.argv[4]==='unknown')p.jobs[1].note='Repair the shirt with some blue cotton buttons. No zipper pull is needed.';const args=[name,JSON.stringify(p)];const hash=await client.writeContract({address:d.address,functionName:'open_session',args,value:0n,leaderOnly:false});d.records.push({hash,functionName:'open_session',args});save('deployment.json',d);console.log(hash);}
