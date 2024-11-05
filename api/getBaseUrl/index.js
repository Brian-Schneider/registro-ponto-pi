module.exports = async function (context, req) {
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: process.env.BASE_URL || 'http://127.0.0.1:5000'
    };
};