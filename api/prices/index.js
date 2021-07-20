const fetch = require('node-fetch');

module.exports = async function (context, req) {
    const apiPath = `https://prices.azure.com/api/retail/prices?${new URLSearchParams(req.query).toString()}`;
    const res = await fetch(apiPath);
    const pricing = await res.json();

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            pricing,
        }
    };
}
