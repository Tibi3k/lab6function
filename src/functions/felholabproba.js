const { app } = require('@azure/functions');

app.storageBlob('felholabproba', {
    path: 'images',
    connection: 'felholab4rendes_STORAGE',
    handler: (blob, context) => {
        context.log(`Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`);
    }
});
