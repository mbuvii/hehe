const {readEnv} = require('../lib/database')
const {cmd , commands} = require('../command')

cmd({
    pattern: "menu",
    desc: "Get comand list",
    category: "main",
    filename: __filename 
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
 const config = await readEnv();   
let menu = {
main: '',
download: '',
group: '',
owner: '',
convert: '',
search: ''
};

for (let i = 0; i < commands.length; i++) {
if (commands[i].pattern && !commands[i].dontAddCommandList) {
menu[commands[i].category] += `${config.PREFIX}${commands[i].pattern}\n`;
 }
}

let madeMenu = '👋🏻*Hello ${pushname}*
> *DOWNLOAD CMDS* ⬇ 

${menu.download}  
  
> *MAIN CMDS* 🌟

${menu.main} 

> *GROUP CMDS* ⏩

${menu.group}

> *OWNER CMDS* 📶

${menu.owner}

>*CONVERT CMDS* ♻

${menu.convert}
  
>*SEARCH CMDS* 🔎

${menu.search}
  
 POWERED BY MBUVI TECH 
'
await conn.sendMessage(from,{image:{url:config.ALIVE_IMG},caption:madeMenu},{quoted:mek})
  
}catch(e){
console.log(e)
reply('${e}')
}
