const axios = require('axios');
const translatte = require('translatte');

const translate = async (text, to) => {
    console.log(text+' ' +to);
    return await translatte(text, {
        to: to,
    });
}

exports.translate = translate;
//google translate API key: AIzaSyCHUCmpR7cT_yDFHC98CZJy2LTms-IwDlM