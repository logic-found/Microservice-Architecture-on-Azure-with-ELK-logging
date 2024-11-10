const { app } = require('@azure/functions');
const logger = require('../logger')

app.http('logout', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        logger.info(`Http request"${request.url}"`);
        logger.info(`Logout success`);
        return {
            status: 200,
            jsonBody: { message: 'Logout successful' }
        };
    }
});
