module.exports = async function (context, req) {
    context.log('echo');

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: req.body,
    };
}
