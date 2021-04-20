import { Upload, Modal, message  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

import {MAX_CONTENT_LEN, S3_GET, S3_UPLOAD, S3_DELETE, S3_GET_SIGNED_POST} from './S3'

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
    top: '2%',
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

const ImageUploader = ({maxNumberOfPictures, pictureKeyArray, setPictureKeyArray, fileList, setFileList}) => {

    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const [currentNumberOfPictures, setCurrentNumberOfPictures] = useState(pictureKeyArray.length)

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
        if(file.type.substring(0, file.type.indexOf('/'))!=='image'){
            message.error("You can only upload images")
            setTimeout(() => {
                setFileList(fileList.filter(
                    file1 => file1.name !== file.name
                ))
                setCurrentNumberOfPictures(fileList.length)
                setPictureKeyArray(pictureKeyArray.filter(key => key.substring(key.lastIndexOf('/') + 1)!==file.uid))
            }, 1000);
        }

        if(file.size>MAX_CONTENT_LEN){
            message.error("Single image cannot exceed 10MB")
            setTimeout(() => {
                setFileList(fileList.filter(
                    file1 => file1.name !== file.name
                ))
                setCurrentNumberOfPictures(fileList.length)
                setPictureKeyArray(pictureKeyArray.filter(key => key.substring(key.lastIndexOf('/') + 1)!==file.uid))
            }, 1000);
        }
        
        setFileList([...fileList])
        setCurrentNumberOfPictures(fileList.length)
    }

    const handleRemove = (file) => {
        setPictureKeyArray(pictureKeyArray.filter(key => key.substring(key.lastIndexOf('/') + 1)!==file.uid))
    }

    const handleBeforeUpload = (file) => {
        setPictureKeyArray([...pictureKeyArray, `ProductDetailPhotos/${file.uid}`])
        return false
    }

    return (
        <div style={{textAlign: 'left'}}>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                onRemove={handleRemove}
                beforeUpload={handleBeforeUpload}
                // accept="image/*"
                // maxCount={maxNumberOfPictures}
            >
                
                {fileList.length >= maxNumberOfPictures ? null : uploadButton}
            </Upload>
            {/* <div style={pictureSizeStyle}>(Each picture should be less than 10MB)</div> */}
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
