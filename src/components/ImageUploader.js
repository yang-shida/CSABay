import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

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

    

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewVisible(true)
        setPreviewImage(file.url || file.preview)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    };

    const handleChange = ({ fileList }) => {
        setFileList(fileList)
        setCurrentNumberOfPictures(fileList.length)
    }

    return (
        <div style={{textAlign: 'left'}}>
            <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
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
