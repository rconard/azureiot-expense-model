const fetch = require('node-fetch');

module.exports = async function (context, req) {
    const pricing = [];

    let pricesApiUrl = `https://prices.azure.com/api/retail/prices?${new URLSearchParams(req.query).toString()}`;
    while (pricesApiUrl) {
        const apiPath = pricesApiUrl;
        const requestPricing = await fetch(apiPath);
        const responsePricing = await requestPricing.json();
        if (pricesApiUrl) {
            pricesApiUrl = responsePricing.NextPageLink;
        }

        pricing.push(...responsePricing.Items);
    }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            pricing,
        }
    };
}
