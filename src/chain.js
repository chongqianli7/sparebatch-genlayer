import {createClient,createAccount,generatePrivateKey} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import source from '../contracts/sparebatch.py?raw';
export const reader=createClient({chain:studionet,endpoint:'https://studio.genlayer.com/api'});
export const sourceText=source;
export async function verify(address){if(!/^0x[0-9a-fA-F]{40}$/.test(address))throw Error('Enter a contract address.');const [code,protocol]=await Promise.all([reader.getContractCode(address),reader.readContract({address,functionName:'protocol',args:[]})]);if(code!==source||protocol!=='sparebatch-1')throw Error('Contract source or protocol does not match this application.');return true}
export async function connect(){const p=window.okxwallet??window.ethereum;if(!p)throw Error('No browser wallet found. Open this page in a wallet browser or use a test signer.');const addresses=await p.request({method:'eth_requestAccounts'});try{await p.request({method:'wallet_switchEthereumChain',params:[{chainId:'0xf22f'}]})}catch(e){if(e.code!==4902)throw e;await p.request({method:'wallet_addEthereumChain',params:[{chainId:'0xf22f',chainName:'GenLayer Stable Studionet',rpcUrls:['https://studio.genlayer.com/api'],nativeCurrency:{name:'GEN',symbol:'GEN',decimals:18},blockExplorerUrls:['https://explorer-studio.genlayer.com']}]})}if((await p.request({method:'eth_chainId'})).toLowerCase()!=='0xf22f')throw Error('Switch to Stable Studionet 61999.');return{address:addresses[0].toLowerCase(),client:createClient({chain:studionet,account:addresses[0],provider:p})}}
export function testSigner(){let key=localStorage.getItem('sparebatch-test-key');if(!key){key=generatePrivateKey();localStorage.setItem('sparebatch-test-key',key)}const a=createAccount(key);return{address:a.address.toLowerCase(),client:createClient({chain:studionet,account:a}),test:true}}
export async function inspect(address,owner,name){const raw=await reader.readContract({address,functionName:'inspect',args:[owner,name],transactionHashVariant:'latest-final'});return raw?JSON.parse(raw):null}

export {decodedCall} from './receipt.js';
