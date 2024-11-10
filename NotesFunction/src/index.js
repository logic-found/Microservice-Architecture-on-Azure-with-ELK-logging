const { app } = require('@azure/functions');

app.setup({
    enableHttpStream: true,
    cors: {      
        allowedOrigins: ['*'],
        allowedMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
});
