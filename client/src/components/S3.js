// import {MAX_CONTENT_LEN, S3_GET, S3_UPLOAD, S3_DELETE, S3_GET_SIGNED_POST, S3_DELETE_BY_KEY} from './S3'

import { responsiveArray } from 'antd/lib/_util/responsiveObserve';
import AWS from 'aws-sdk';
import axios from "axios";

export const MAX_CONTENT_LEN = 10485760
// const base_ = "http://localhost:3001";
const base_ = ""

const config = {
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    region: process.env.AWS_S3_REGION,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
}

AWS.config.update({
    region: config.region,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
});

export const S3_GET = async (key) => {
    const url = await axios.post(base_ + '/api/s3-get-url', {key: key})
        .then(
            (res) => {
                if(res.data.code===1){
                    return ''
                }
                else{
                    return res.data.url
                }
            }
        )
        .catch(
            (err) => {
                console.log(err)
                return ''
            }
        )

    return url
}

export const S3_UPLOAD = async (signed, fileList, index) => {
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
        
            axios.post(
                signed.url,
                formData,
                {withCredentials: false}
            )
                .then(
                    () => {
                        resolve("S3 Upload OK!")
                    }
                )
                .catch (
                    (err) => {
                        reject(err)
                    }
                ) 
        }
    )
    
}

export const S3_UPLOAD_SINGLE_FILE = (signed, file) => {
    return new Promise(
        async (resolve, reject) => {
            const data = {
                ...signed.fields,
                'Content-Type': file.type,
                file: file
            }
        
            const formData = new FormData()
            for (const name in data){
                formData.append(name, data[name])
            }
        
            axios.post(
                signed.url,
                formData,
                {withCredentials: false}
            )
                .then(
                    () => {
                        resolve("S3 Upload OK!")
                    }
                )
                .catch (
                    (err) => {
                        console.log(err)
                        reject(err)
                    }
                ) 
        }
    )
}

export const S3_DELETE = async (file) => {
    return new Promise(
        (resolve, reject) => {
            axios.post(base_ + '/api/s3-delete-by-key', {key: `ProductDetailPhotos/${file.uid}`})
                .then(
                    (res) => {
                        if(res.data.code === 1){
                            reject(res.data.message)
                        }
                        else{
                            resolve()
                        }
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        reject("Fail to delete object")
                    }
                )
        }
    )
}

export const S3_DELETE_BY_KEY = async (key) => {
    return new Promise(
        (resolve, reject) => {
            if(key==""){
                resolve()
            }
            axios.post(base_ + '/api/s3-delete-by-key', {key: key})
                .then(
                    (res) => {
                        if(res.data.code === 1){
                            reject(res.data.message)
                        }
                        else{
                            resolve()
                        }
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        reject("Fail to delete object")
                    }
                )
        }
    )
    
}



export const S3_GET_SIGNED_POST = (file, dir) => {
    return new Promise(
        (resolve, reject) => {
            axios.post(base_ + '/api/s3-get-signed-post', {fileUid: file.uid, dir: dir})
                .then(
                    (res) => {
                        if(res.data.code === 1){
                            reject(res.data.message)
                        }
                        else{
                            resolve(res.data.signed)
                        }
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        reject("Fail to create pre-signed post")
                    }
                )
        }
    )

}

export const S3_GET_OBJECT_TYPE = (key) => {
    return new Promise(
        (resolve, reject) => {
            axios.post(base_ + '/api/s3-get-object-type', {key: key})
                .then(
                    (res) => {
                        if(res.data.code === 1){
                            reject(res.data.message)
                        }
                        else{
                            resolve(res.data.type)
                        }
                    }
                )
                .catch(
                    (err) => {
                        console.log(err)
                        reject("Fail to get object type")
                    }
                )
        }
    )
}