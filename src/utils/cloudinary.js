import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from 'fs';

// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadonCloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null;
        // upload the file on cloudinary
        const uploadResult = await cloudinary.uploader.upload(localfilepath, {
            resource_type: 'auto'
        })
        // file has been uploaded successfully
        console.log("File is uploaded on cloudinary",
            response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localfilepath) //remove the locally saved file as the upload opertion got

    }
}

export { uploadonCloudinary };

/*
cloudinary.v2.uploader.upload("sample.jpg", { Public_id: "sample" },
function (error, result) { console.log(result, error); });
*/

