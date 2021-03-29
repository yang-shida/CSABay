import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import S3FileUpload from 'react-s3';
 
//Optional Import
import { uploadFile } from 'react-s3';

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

    const [action, setAction] = useState('')

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewVisible(true)
        setPreviewImage(file.url || file.preview)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    };

    const handleChange = ({ fileList, event }) => {
        setFileList(fileList)
        setCurrentNumberOfPictures(fileList.length)
    }

    const handleUpload = async ({file}) => {
        
        console.log("file: ", file)

        var S3 = new AWS.S3();
        await S3.createPresignedPost({
            Fields: {
                key: uuidv4(),
            },
            Expires: 30,
            Bucket: config.bucketName,
        }, (err, signed) => {
            const objParams = {
                Key: `${config.dirName}/${signed.fields.key}`,
                Bucket: signed.fields.bucket,
                Body: file,
                ContentType: file.type,
                Metadata: {
                    ...signed.fields
                },
            };

            S3.putObject(objParams, function(err, data) {
                if (err){
                    console.log("Something went wrong");
                    console.log(err, err.stack);
                }
                else{
                    console.log("SEND FINISHED")
                }    
            });
            
        })
    }

    return (
        <div style={{textAlign: 'left'}}>
            <input type="file" onChange={(e)=>{
                S3FileUpload
                .uploadFile(e.target.files[0], config)
                .then(data => console.log(data))
                .catch(err => console.error(err))
            }}/>
            <Upload
                // action="https://csabayphotos.s3.amazonaws.com/"
                // action={action}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                // beforeUpload={handleBeforeUpload}
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
