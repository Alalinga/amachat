const { getDate } = require('./date');

class Formater{
    constructor(){
        this.date = getDate();
    }
    privateChatMessageFormat(chatId,message, to, from) {
        return {
            chatId,
            message,
            to,
            from,
            date: this.date.date,
            time: this.date.time
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
        return {
            user,
            id,
            message,
            date: this.date.date,
            time: this.date.time
        }
    }
    groupChatFormat(groupName,message){
        return{
            groupName,
            message: this.messageFormat(message.user,message.id,message.message)
        }

    }
}
const formater = new Formater
module.exports ={ formater}