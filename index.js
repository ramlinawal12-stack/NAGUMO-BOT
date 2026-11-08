// Abdo___HD 🥷🔱 0750649595 - sanfoura___HD 🫦🦋 0641618268
const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys')
const P = require('pino')
const DEVS = ['212750649595','212641618268']
const BAD = ['زبي','نيك','قحبة','طبون','زب','منيوك']
let S = {}
async function start(){
const {state,saveCreds}=await useMultiFileAuthState('abdo')
const sock=makeWASocket({logger:P({level:'silent'}),auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,P({level:'silent'}))},browser:['Abdo___HD','Chrome','1.0']})
sock.ev.on('creds.update',saveCreds)
if(!sock.authState.creds.registered){setTimeout(async()=>{try{const c=await sock.requestPairingCode('212750649595');console.log(`🥷🔱 كود Abdo___HD: ${c}`)}catch{}},3000)}
sock.ev.on('connection.update',u=>{if(u.connection==='open')console.log('✅ Bot Abdo خدام');if(u.connection==='close')start()})
sock.ev.on('group-participants.update',async a=>{
if(a.action!=='add')return
for(let p of a.participants){
let d=DEVS.some(x=>p.includes(x))
if(d){
let url;try{url=await sock.profilePictureUrl(p,'image')}catch{}
let cap=`مرحبا Abdo 🥷🔱\n🥷🔱 Abdo___HD 0750649595\n🫦🦋 sanfoura___HD 0641618268`
if(url) await sock.sendMessage(a.id,{image:{url},caption:cap,mentions:[p]})
else await sock.sendMessage(a.id,{text:cap,mentions:[p]})
}else{
await sock.sendMessage(a.id,{text:`⛔ طرد @${p.split('@')[0]}`,mentions:[p]})
await sock.groupParticipantsUpdate(a.id,[p],'remove')
}}})
sock.ev.on('messages.upsert',async({messages})=>{
const m=messages[0];if(!m.message||m.key.fromMe)return
const from=m.key.remoteJid;if(!from.endsWith('@g.us'))return
const sender=m.key.participant||m.key.remoteJid
const isDev=DEVS.some(x=>sender.includes(x))
const body=m.message.conversation||m.message.extendedTextMessage?.text||m.message.imageMessage?.caption||m.message.stickerMessage?'sticker':''
const txt=body.toLowerCase()
if(!S[from])S[from]={t:false,a:false}
const link=txt.includes('https://')||txt.includes('chat.whatsapp.com')||txt.includes('wa.me')
const bad=BAD.some(w=>txt.includes(w))
const sticker=body==='sticker'
if(!isDev){
if(link){await sock.sendMessage(from,{delete:m.key}).catch(()=>{});await sock.groupParticipantsUpdate(from,[sender],'remove');return}
if(bad||sticker){await sock.sendMessage(from,{delete:m.key}).catch(()=>{});return}
if(S[from].a)return
if(S[from].t){await sock.sendMessage(from,{delete:m.key}).catch(()=>{});return}
}
if(txt.includes('سلام')){await sock.sendMessage(from,{text:'وعليكم السلام Abdo 🥷🔱'})}
if(!isDev)return
if(txt=='3تكتيم'){S[from].t=true;await sock.sendMessage(from,{text:'✅ 3تكتيم 🥷🔱'})}
if(txt=='4صمت'){S[from].a=true;await sock.sendMessage(from,{text:'✅ 4صمت 🥷🔱'})}
if(txt=='5اطلق'||txt=='اطلق'){S[from].t=false;S[from].a=false;await sock.sendMessage(from,{text:'✅ 5اطلق 🥷🔱'})}
if(txt.includes('صورة المطور')||txt=='6'){try{let u=await sock.profilePictureUrl('212750649595@s.whatsapp.net','image');await sock.sendMessage(from,{image:{url:u},caption:'🥷🔱 Abdo___HD 0750649595'})}catch{await sock.sendMessage(from,{text:'🥷🔱 Abdo___HD 0750649595'})}}
if(txt.includes('مطورة')){try{let u=await sock.profilePictureUrl('212641618268@s.whatsapp.net','image');await sock.sendMessage(from,{image:{url:u},caption:'🫦🦋 sanfoura___HD 0641618268'})}catch{await sock.sendMessage(from,{text:'🫦🦋 sanfoura___HD'})}}
})}
start()
