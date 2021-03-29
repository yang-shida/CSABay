import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

import axios from "axios";

import AWS from 'aws-sdk';

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

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const itemCounterStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    position: 'absolute',
    top: '95%',
    left: '98%',
    transform: 'translate(-100%, -100%)',
    textAlign: 'Right', 
    fontSize: '13pt'
};

const pictureSizeStyle = {
    fontFamily: 'Arial, Helvetica, sans-serif',
    position: 'absolute',
    bottom: '5%',
    left: '2%',
    textAlign: 'Left', 
    fontSize: '13pt'
}

const uploadButton = (
    <div>
        <PlusOutlined />
        <div style={{  marginTop: 8 }}>Upload</div>
    </div>
);

const ImageUploader = ({maxNumberOfPictures, pictureKeyArray, setPictureKeyArray}) => {

    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const [fileList, setFileList] = useState([])
    const [currentNumberOfPictures, setCurrentNumberOfPictures] = useState(fileList.length)

    const S3_UPLOAD = async (signed, file, onError, onProgress, onSuccess) => {
        const data = {
            ...signed.fields,
            'Content-Type': file.type,
            file: file
        }

        const formData = new FormData()
        for (const name in data){
            formData.append(name, data[name])
        }

        const uploadConfig = {
            onUploadProgress: event => {
                onProgress({ percent: (event.loaded / event.total) * 100 });
            }
        };

        try {
            const res = await axios.post(
                signed.url,
                formData,
                uploadConfig
            );

            console.log(res)
    
            onSuccess("OK!")
            // setTimeout(()=>{onSuccess("OK!")},1000)
            setPictureKeyArray([...pictureKeyArray, signed.fields.key])
            console.log("add: ", signed.fields.key.substring(signed.fields.key.lastIndexOf('/') + 1))
        } catch (err) {
            onError(err)
        }
    }

    const S3_DELETE = async (file) => {
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

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewVisible(true)
        setPreviewImage(file.url || file.preview)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    };

    const handleChange = ({ fileList, file, event }) => {
        // console.log("change event: ", event)
        // console.log("change file: ", file)
        // console.log("change file list: ", fileList)
        setFileList([...fileList])
        setCurrentNumberOfPictures(fileList.length)
    }

    const handleRemove = (file) => {
        console.log("removing: ", file.uid)
        S3_DELETE(file)
        setPictureKeyArray(pictureKeyArray.filter(key => key.substring(key.lastIndexOf('/') + 1)!==file.uid))
    }

    const handleUpload = async ({file, onError, onProgress, onSuccess}) => {

        const MAX_CONTENT_LEN = 10485760

        if(file.type.substring(0, file.type.indexOf('/'))!=='image'){
            onError(undefined, "You can only upload images")
            return
        }

        if(file.size>MAX_CONTENT_LEN){
            onError(undefined, "Single image cannot exceed 10MB")
            return
        }

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
        }, async (err, signed) => {
            if(err){
                console.log("Fail to create pre-signed post")
                console.log(err)
                onError(err)
            }
            if(signed){
                console.log("Created pre-signed post")
                console.log(signed)
            }

            S3_UPLOAD(signed, file, onError, onProgress, onSuccess)
        })




    }

    return (
        <div style={{textAlign: 'left'}}>
            <Upload
                listType="picture-card"
                defaultFileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                onRemove={handleRemove}
                customRequest={handleUpload}
            >
                {fileList.length >= maxNumberOfPictures ? null : uploadButton}
            </Upload>
            <span style={pictureSizeStyle}>(Each picture should be less than 10MB)</span>
            <span style={itemCounterStyle}>{`${currentNumberOfPictures}/${maxNumberOfPictures}`}</span>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
                width={800}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    )
}

export default ImageUploader
