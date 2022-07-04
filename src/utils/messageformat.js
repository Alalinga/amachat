const { getDate } = require('./date');


const date = getDate(new Date());

class Formater{
    privateChatMessageFormat(chatId,message, to, from) {
        
        return {
            chatId,
            message,
            to,
            from,
            date: date.date,
            time: date.time
        }
    }
    oneOnoneMessageFormat(chatId,myChats,friendChats) {
        return {
            chatId,
            myChats,
            friendChats
        }
    }

    messageFormat = (user, id, message) => {
        console.log('executing message format',date.time)
        return {
            user,
            id,
            message,
            date: date.date,
            time: date.time
        }
    }
    groupChatFormat(groupName,chat){
        return{
            groupName,
            message: this.messageFormat(chat.user,chat.id,chat.message)
        }

    }
}
const formater = new Formater
module.exports ={ formater}