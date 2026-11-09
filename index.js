// Abdo___HD0750649595🥷🔱 - sanfoura___HD🫦🦋 0641618268
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys')
const P = require('pino')
const fs = require('fs')

const DEVELOPERS = ["212750649595","212641618268","750649595","641618268","212750649595"]
let taktim = {} // 3 تكتيم
let samt = {} // 4 صمت

const BAD = ["زامل","قحبة","نيك","زب","زبي","ترمة","كس","طيز","قحب","منيوك","زك"]

async function start() {
  const { version } = await fetchLatestBaileysVersion()
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  const sock = makeWASocket({
    version,
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    auth: state,
    browser: ['Abdo_HD','Chrome','1.0']
  })
  sock.ev.on('creds.update', saveCreds)

  // كود الاقتران
  if(!sock.authState.creds.registered){
    await new Promise(r=>setTimeout(r,4000))
    try{
      const code = await sock.requestPairingCode('212750649595')
      console.log('\n[ NAGUMO CODE ] : '+code+'\n')
    }catch(e){ console.log('Pairing Error:', e.message) }
  }

  sock.ev.on('connection.update', async (u) => {
    const { connection, lastDisconnect } = u
    if(connection === 'open'){
      console.log('مرحبا Abdo 🥷🔱 البوت خدام')

      try{
        // ضع في اسم بوت Abdo___HD0750649595🥷🔱
        await sock.updateProfileName('Abdo___HD0750649595🥷🔱 | sanfoura___HD🫦🦋')

        // ارسال اول رسالة + ارسال صورة بروفيل Abdo___HD0750649595🥷🔱
        if(fs.existsSync('./abdo.jpg')){
          await sock.updateProfilePicture(sock.user.id, { url: './abdo.jpg' })
        }
        
        // ارسال صورة بروفايل sanfoura___HD🫦🦋 0641618268
        // ملاحظة: الواتساب كيخلي بروفايل واحد فقط، الثاني غادي نرسلوه كصورة فالخاص للمطور
        const devJid = '212750649595@s.whatsapp.net'
        if(fs.existsSync('./abdo.jpg')){
          await sock.sendMessage(devJid, { image: { url: './abdo.jpg' }, caption: '✅ تم تشغيل البوت\nAbdo___HD0750649595🥷🔱\nتم وضع الاسم والصورة بنجاح' })
        }
        if(fs.existsSync('./sanfoura.jpg')){
          await sock.sendMessage(devJid, { image: { url: './sanfoura.jpg' }, caption: 'sanfoura___HD🫦🦋 0641618268\nصورة البروفايل الثانية' })
        }
        
        await sock.sendMessage(devJid, { text: 'مرحبا Abdo 🥷🔱\nالبوت خدام دابا 🔱\n\nبوت كيسمع غير لنمر:\n0750649595\n0641618268' })

      }catch(e){ console.log('Profile Error:', e.message) }
    }
    if(connection === 'close' && lastDisconnect?.error?.output?.statusCode != DisconnectReason.loggedOut) start()
  })

  // 2 طرد ترحيب
  sock.ev.on('group-participants.update', async (a) => {
    try{
      if(a.action === 'add'){
        for(let p of a.participants){
          await sock.sendMessage(a.id, { text: `مرحبا Abdo 🥷🔱\nأهلا وسهلا @${p.split('@')[0]} 🫦🦋`, mentions: [p] })
        }
      }
      if(a.action === 'remove'){
        await sock.sendMessage(a.id, { text: `تم طرد @${a.participants[0].split('@')[0]} 👋`, mentions: a.participants })
      }
    }catch{}
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if(!msg.message) return
    const from = msg.key.remoteJid
    if(!from.endsWith('@g.us')) return

    const sender = msg.key.participant || msg.key.remoteJid
    const num = sender.split('@')[0]
    const isDev = DEVELOPERS.some(d => num.includes(d) || sender.includes(d))
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || ''
    const low = body.toLowerCase().trim()

    // 7 منع ملصقة مخلفة القوانين - حذف ملصق
    if(msg.message.stickerMessage){
      if(!isDev){
        try{ await sock.sendMessage(from, { delete: msg.key }) }catch{}
        return
      }
    }

    // حداف كل كلمة خايبة
    if(BAD.some(w => low.includes(w))){
      try{ await sock.sendMessage(from, { delete: msg.key }) }catch{}
      return
    }

    // 3 منع روابط + 8 طرد تلقائي
    if(low.includes('chat.whatsapp.com') || low.includes('https://') || low.includes('http://')){
      if(!isDev){
        try{
          await sock.sendMessage(from, { delete: msg.key })
          await sock.groupParticipantsUpdate(from, [sender], 'remove')
          await sock.sendMessage(from, { text: `🚫 طرد تلقائي @${num} نشر رابط`, mentions: [sender] })
        }catch{}
        return
      }
    }

    // 3 تكتيم - حذف كلشي الا المطور
    if(taktim[from] && !isDev){
      try{ await sock.sendMessage(from, { delete: msg.key }) }catch{}
      return
    }
    // 4 صمت - بوت ساكت مايجاوبش
    if(samt[from] && !isDev) return

    // فقط المطورين كيسمع ليهم - 0750649595 و 0641618268
    if(!isDev){
      // 1 يجوب عربي للجميع
      if(low.includes('بوت') || low === 'bot' || low.includes('السلام')){
        await sock.sendMessage(from, { text: 'مرحبا Abdo 🥷🔱\nأنا خدام ✅' })
      }
      return
    }

    // أوامر المطورين
    if(body === 'تكتيم' || body === '3تكتيم'){
      taktim[from]=true
      await sock.sendMessage(from, { text: '✅ 3تكتيم تفعل\nدابا أي واحد هضر غادي نحذف رسالتو (غير المطورين)' })
    }
    if(body === 'صمت' || body === '4صمت'){
      samt[from]=true
      await sock.sendMessage(from, { text: '✅ 4صمت تفعل\nالبوت سكت 🤫' })
    }
    if(body === 'اطلق' || body === '5اطلق'){
      taktim[from]=false
      samt[from]=false
      await sock.sendMessage(from, { text: '✅ 5اطلق تفعل\nالبوت رجع خدام 🔱' })
    }

    // 6 صورة المطور Abdo HD 🥷🔱
    if(body === 'صورة المطور' || body === '6صورة المطور' || body === 'Abdo'){
      if(fs.existsSync('./abdo.jpg')){
        await sock.sendMessage(from, { image: { url: './abdo.jpg' }, caption: 'صورة المطور Abdo HD 🥷🔱\n0750649595' })
      }
    }
    // صورة مطورة sanfoura __HD🫦🦋
    if(body === 'صورة مطورة' || body === 'sanfoura' || body === 'صورة المطورة'){
      if(fs.existsSync('./sanfoura.jpg')){
        await sock.sendMessage(from, { image: { url: './sanfoura.jpg' }, caption: 'صورة مطورة sanfoura__HD🫦🦋\n0641618268' })
      }
    }

    if(body === '.منيو' || body === 'منيو'){
      await sock.sendMessage(from, { text: `*🤖 منيو Abdo___HD🥷🔱*\n\n*للمطورين فقط:*\n0750649595\n0641618268\n\n1 يجاوب عربي ✅\n2 ترحيب وطرد ✅\n3 منع روابط + طرد تلقائي ✅\n3 تكتيم (حذف رسائل الاعضاء)\n4 صمت (البوت يسكت)\n5 اطلق (يلغي تكتيم/صمت)\n6 صورة المطور\nصورة مطورة\nحذف كلام خايب ✅\n7 منع ملصقات ✅\n\nاكتب: تكتيم / صمت / اطلق` })
    }

  })
}
start()
