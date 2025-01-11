const axios = require('axios');

const getBuffer = async (url, options) => {
    try {
        const res = await axios({
            method: 'get',
            url,
            responseType: 'arraybuffer',
        });
        return res.data;
    } catch (e) {
        console.error(e);
    }
};

module.exports = { getBuffer };
