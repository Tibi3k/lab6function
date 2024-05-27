const { app } = require('@azure/functions');
const sharp = require("sharp");
const { BlobServiceClient } = require('@azure/storage-blob');

module.exports =  async (blob, context) => {
        console.log(blob)
        console.log(context)
        context.log(`Storage blob function processed blob "${context.bindingData.name}" with size ${blob.length} bytes`);

        try {
            // Create a thumbnail
            const thumbnail = await sharp(blob)
                .resize(150, 150) // Resize image to 150x150 pixels
                .toBuffer();
    
            // Get the blob service client
            const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AzureWebJobsStorage);
            context.triggerMetadata.blobTrigger.split("/")[1]
            // Get a container client
            const containerClient = blobServiceClient.getContainerClient("thumbnails");
    
            // Get a block blob client
            const blobName = context.triggerMetadata.blobTrigger.split("/")[1]
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
            // Upload the thumbnail to the output container
            await blockBlobClient.upload(thumbnail, thumbnail.length);
    
            context.log("Thumbnail created and uploaded successfully.");
        } catch (error) {
            context.error("Error creating thumbnail:", error.message);
        }
    }
