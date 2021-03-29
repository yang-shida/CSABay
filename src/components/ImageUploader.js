import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

import axios from "axios";

import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

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

const uploadButton = (
    <div>
        <PlusOutlined />
        <div style={{  marginTop: 8 }}>Upload</div>
    </div>
);

const ImageUploader = ({maxNumberOfPictures}) => {

    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const [fileList, setFileList] = useState([])
    const [currentNumberOfPictures, setCurrentNumberOfPictures] = useState(fileList.length)
    const [progress, setProgress] = useState(0);

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewVisible(true)
        setPreviewImage(file.url || file.preview)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    };

    const handleChange = ({ fileList, file }) => {
        setFileList(fileList)
        setCurrentNumberOfPictures(fileList.length)
    }

    const handleRemove = (file) => {
        console.log("removing: ", file)
    }

    const handleUpload = async ({file, onError, onProgress, onSuccess}) => {
        onProgress(file)
        var S3 = new AWS.S3();

        var signedObj;

        S3.createPresignedPost({
            Fields: {
                key: `${config.dirName}/${uuidv4()}`,
            },
            Expires: 30,
            Bucket: config.bucketName,
            Conditions: [
                ["starts-with", "$Content-Type", ""]
            ]
        }, async (err, signed) => {
            if(err){
                console.log("Fail to create pre-signed post")
                console.log(err)
            }
            if(signed){
                console.log("Created pre-signed post")
                console.log(signed)
                signedObj = signed
            }

            const data = {
                bucket: config.bucketName,
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
                    const percent = Math.floor((event.loaded / event.total) * 100);
                    setProgress(percent);
                    if (percent === 100) {
                        setTimeout(() => setProgress(0), 1000);
                    }
                    onProgress({ percent: (event.loaded / event.total) * 100 });
                }
            };

            try {
                const res = await axios.post(
                    signed.url,
                    formData,
                    uploadConfig
                );
        
                onSuccess()
            } catch (err) {
                onError(file)
            }

            // const res = await fetch(signed.url, {
            //     method: 'POST',
            //     body: formData,
            // })

            // if(res.ok){
            //     onSuccess()
            // }
            // else{
            //     onError(file)
            // }

            
            // const objParams = {
            //     Key: `${config.dirName}/${signed.fields.key}`,
            //     Bucket: signed.fields.bucket,
            //     Body: file,
            //     ContentType: file.type,
            //     Metadata: {
            //         ...signed.fields
            //     },
            // };

            // S3.putObject(
            //     objParams, 
            //     function(err, data) {
            //         if (err){
            //             console.log("Something went wrong");
            //             console.log(err, err.stack);
            //             onError()
            //         }
            //         else{
            //             console.log("SEND FINISHED")
            //             onSuccess()
            //         }    
            //     }
            // )
            // .on(
            //     "httpUploadProgress", 
            //     function({ loaded, total }) {
            //         onProgress(
            //             {percent: Math.round((loaded / total) * 100)},
            //             file
            //         )
            //     }
            // )
        })




    }

    return (
        <div style={{textAlign: 'left'}}>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                onRemove={handleRemove}
                customRequest={handleUpload}
            >
                {fileList.length >= maxNumberOfPictures ? null : uploadButton}
            </Upload>
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
