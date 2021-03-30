// import {MAX_CONTENT_LEN, S3_GET, S3_UPLOAD, S3_DELETE, S3_GET_SIGNED_POST} from './S3'

import AWS from 'aws-sdk';
import axios from "axios";

export const MAX_CONTENT_LEN = 10485760

const config = {
    bucketName: 'csabayphotos',
    dirName: 'ProductDetailPhotos', /* optional */
    region: 'us-east-2',
    accessKeyId: 'AKIA2SGQI5JKBX7R45YB',
    secretAccessKey: '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',
}

AWS.config.update({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
});

export const S3_GET = (key) => {
    var S3 = new AWS.S3();
    var params = {Bucket: config.bucketName, Key: key, Expires: 60};
    var url = S3.getSignedUrl('getObject', params);
    console.log('The URL is', url);
    return url
}

export const S3_UPLOAD = async (signed, fileList, index, value, setValue) => {
    return new Promise(
        async (resolve, reject) => {
            const data = {
                ...signed.fields,
                'Content-Type': fileList[index].type,
                file: fileList[index].originFileObj
            }
        
            const formData = new FormData()
            for (const name in data){
                formData.append(name, data[name])
            }
        
            const uploadConfig = {
                onUploadProgress: event => {
                    fileList[index] = {...fileList[index], status: "uploading", percent: (event.loaded / event.total) * 100}
                    setValue(value+1)
                }
            };
        
            axios.post(
                signed.url,
                formData,
                uploadConfig
            )
                .then(
                    () => {
                        fileList[index].status = 'done'
                        setValue(value+1)
                        console.log("add: ", signed.fields.key.substring(signed.fields.key.lastIndexOf('/') + 1))
                        resolve("S3 Upload OK!")
                    }
                )
                .catch (
                    (err) => {
                        fileList[index].status = 'error'
                        setValue(value+1)
                        reject(err)
                    }
                ) 
        }
    )
    
}

export const S3_DELETE = async (file) => {
    // send request to backend
    var S3 = new AWS.S3();
    var res;
    var params = {
        Bucket: config.bucketName, 
        Key: `ProductDetailPhotos/${file.uid}`
    };
    S3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(`Delete success: ProductDetailPhotos/${file.uid}`)           // successful response
    });

    // confirm delete
}

export const S3_GET_SIGNED_POST = (file) => {
    return new Promise(
        (resolve, reject) => {
            var S3 = new AWS.S3();

            S3.createPresignedPost({
                Fields: {
                    key: `${config.dirName}/${file.uid}`,
                },
                Expires: 30,
                Bucket: config.bucketName,
                Conditions: [
                    ["starts-with", "$Content-Type", "image/"],
                    ["content-length-range", 0, MAX_CONTENT_LEN+1000000]
                ]
            }, (err, signed) => {
                if(err){
                    console.log("Fail to create pre-signed post")
                    console.log(err)
                    reject(err)
                }
                if(signed){
                    console.log("Created pre-signed post")
                    console.log(signed)
                    resolve(signed)
                }
            })
        }
    )

}