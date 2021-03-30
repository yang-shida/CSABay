import React from 'react'
import { Image } from 'antd';

const ImageWall = ({images}) => {
    return (
        <div>
            <Image.PreviewGroup>
                {
                    images.map(
                        (image) => (
                            <Image
                                key={image.id}
                                width={200}
                                src={image.url}
                            />
                        )
                    )
                }
            </Image.PreviewGroup>
        </div>
    )
}

export default ImageWall
