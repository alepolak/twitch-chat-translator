# Twitch Chat Translator

The Twitch Chat Translator let you interact with the chat of a Twitch Channel that it's on a foreign language without having to worry about the translations. Just receive the messages writen in the foreign language in the language that you want, and send messages writen in your language that are automatically translated so everyone can understand.

# Twitch Chat Translator App #

## Settings ##
1. Twitch Channel: the name of the channel that you want to translate the chat.
2. Your Username: your username logged into Twitch. This is only used so the app doesn't translate the incoming message from it.
3. Channel lan: the language of the channel. 
4. Your lang: the language that you are using.


## How it work ##
The first thing that you want to do is configure all the data from the 'Settings' dropdown and save it.

After that you will start receiving all the messages written in the `Twitch Channel` chat in the chosen `Channel Lang` translated to the chosen `Your Lang`.

You can also use the input field to send a message that is automaticaly translated from `Your Lang` to `Channel Lang`.


## Dependency ##

The app needs the Twitch Chat Translator API running to work.


# Twitch Chat Translator API #

## Run the API ##

Navigate to the `stream-translator-api` folder and run: 
```
npm install
npm start
```

## API ##

### Send a translated message to the Twitch Chat. ###
```http
POST /chat?message=messageString
```
`@param {string} req.query.message` the message that is going to be translated and sent to the chat.


### Get all the translated messages from the chat that are in the "messages" buffer. ###
```http
GET /chat
```
`@param {int} req.params.amount [optional]` the amount of messages to get.  
Returns an array of chat messages in the 'Native Language'.


### Set the channel that the bot is going to listen and connect to it. ###
```http
POST http://localhost:3001/channel/wyqywyqy
```
`@param {string} req.params.channelName` name of the channel to connect to.


### Set the languages that the bot is going to use for translation. ###
```http
POST http://localhost:3001/language?nativeLanguage=es&foreignLanguage=ko
```
`@param {string} req.query.nativeLanguage` the language that you are going to see in the app chat.

`@param {string} req.query.foreignLanguage` the lenguage that the Twitch channel uses.


### Set the Twitch username that is using the bot. This is to ignore the messages of that user. ###
```http
POST http://localhost:3001/me/alkepo
```
`@param {String} req.params.username` the Twitch username that you are using.



