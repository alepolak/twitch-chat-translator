require('dotenv').config();
const tmi = require('tmi.js');

const { translate } = require('./Translator');

class Controller {

    client = null;
    messages = [];
    nativeLanguage = 'es';
    foreignLanguage = 'en';
    channelName = '';
    myUsername = '';

    constructor() { }

    /**
     * Set the channel that the bot is going to listen and connect to it.
     * Also set the client listener to the chat.
     * @param {string} req.params.channelName name of the channel to connect.
     */
    setChannelName = (req, res) => {       
        const channelName = req.params.channelName;
        console.log(`Setting channel name to: ${channelName}`);
        if(channelName) {    
            this.channelName = channelName;
            this.connectToClient(res);
        }
    }

    /**
     * Print the channel name that the bot is connected to.
     */
    getChannel = (req, res) => {
        console.log(`Connect to channel: ${this.channelName}`);
        res.sendStatus(200);
    }

    /**
     * Set the languages that the bot is going to use for translation.
     * @param {string} req.query.nativeLanguage the language that you are going to see in the chat.
     * @param {string} req.query.foreignLanguage the lenguage that the Twitch channel uses.
     */
    setLanguages = (req, res) => {
        if(req.query.nativeLanguage)
            this.nativeLanguage = req.query.nativeLanguage;

        if(req.query.foreignLanguage)
            this.foreignLanguage = req.query.foreignLanguage;
  
        res.sendStatus(200);
    }

    /**
     * Print the selected languages of the bot.
     */
    getLanguages = (req, res) => {
        console.log(`Selected languages - Native: ${this.nativeLanguage} Foreign: ${this.foreignLanguage}`);
        res.sendStatus(200);
    }

    /**
     * Send a translated message to the Twitch Chat. 
     * @param {*} req.query.message the message that is going to be translated and sent to the chat.
     */
    sendMessage = async (req, res) => {      
        console.log(req.query.message); 
        console.log(this.foreignLanguage);
        console.log(translate);
        translate(req.query.message, this.foreignLanguage)
        .then(translationRes => {
            console.log(`then(res => ${translationRes.text})`);
            if(translationRes.text)
                this.client.say(this.channelName, translationRes.text);
            
            res.sendStatus(200);
        })
        .catch(error => {
            console.log(error);
            this.sendError(res, error);
        });
    }

    /**
     * Get all the translated messages from the chat that are in the "messages" buffer.
     * @param {int} req.params.amount [optional] the amount of messages to get.  
     * @returns an array of chat messages in the 'Native Language'.
     */
    getMessages = (req, res) => {

        let responseMesseges = [];
        if(this.areUnreadMessages()) {
            if(req.params.amount) {
                for (let i = 0; i < req.params.amount; i++) {
                    responseMesseges.push(this.messages.shift());                  
                }
            }
            else {
                responseMesseges = this.messages;
                this.messages = [];
            }

            console.log(`Returning ${responseMesseges.length} messages.`);
            return responseMesseges;
        }

        console.log(`You are up to date with the messages !.`);
        return {};
    }

    /**
     * Gets the first message of the "messages" buffer.
     * @returns the first message of the "messages" buffer.
     */
    getMessage = () => {
        if(this.messages.length > 0) {
            console.log(`Getting the following message: ${this.messages[0]}`);
            return this.messages.shift();
        }
        
        return {};
    }

    /**
     * Set the Twitch username that is using the bot. This is to ignore the messages of that user.
     * @param {String} req.params.username the Twitch username that is using the bot. 
     */
    setMyUsername = (req, res) => {
        this.myUsername = req.params.username;
        res.sendStatus(200);
    }

    /**
     * Prints and return the Twitch username that is using the bot.
     * @returns the Twitch username that is using the bot.
     */
    getMyUsername = (req, res) => {
        console.log(`My username is ${this.myUsername}`);
        return this.myUsername;
    }

    
    areUnreadMessages = () => { 
        return this.messages.length > 0;
    }

    getClient = (channelName) => {
        return new tmi.Client({
            connection: {
                reconnect: true
            },
            identity: {
                username: process.env.TWITCH_BOT_USERNAME,
                password: process.env.TWITCH_OAUTH_TOKEN
            },
            channels: [ channelName ]
        });
    }
    
    connectToClient(res) {
        this.client = this.getClient(this.channelName);    
        this.client.connect()
        .then(() => res.sendStatus(200))
        .catch((error) => this.sendError(res, error));
        this.setListener();
    }

    setListener = () => {
        this.client.on('message', (channel, tags, message, self) => {
            
            console.log(`On message "${message}" recieved from: ${tags.username.toLocaleLowerCase()} - Translate it to ${this.nativeLanguage}`);

            if(this.myUsername != tags.username.toLocaleLowerCase()) {

                const isBot = tags.username.toLocaleLowerCase() == process.env.TWITCH_BOT_USERNAME;           
                //console.log(`self: ${self} messageUser: ${tags.username.toLocaleLowerCase()} botName: ${process.env.TWITCH_BOT_USERNAME}`);     
                //console.log(!isBot+' '+!self);
                if(!isBot && !self) {
                    translate(message, this.nativeLanguage)
                    .then(translatedMessage => {
                        console.log(`pushed message: ${translatedMessage.text}`)
                        this.messages.push({
                            username: tags.username, 
                            message: translatedMessage.text
                        });
                    })
                    .catch(error => {
                        this.sendError(null, error);
                    });
                }
            }
        });
    }

    sendError(res, error) {
        switch (error.code) {
            case 'ERR_INVALID_URL':
                res.sendStatus(400);
                break;      
            default:
                res.sendStatus(400);
                break;
        }
    }
}

module.exports = Controller;