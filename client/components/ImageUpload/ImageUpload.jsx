import React from 'react';
import {Button, Form, Icon, Image, Input, Segment} from "semantic-ui-react";
import PropTypes from 'prop-types'
import './ImageUpload.scss'

class ImageUpload extends React.Component {

  processImageChange(e) {
    const {handleAddImage} = this.props

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      handleAddImage(reader.result)
    }

    reader.readAsDataURL(file)
  }

  render() {
    const {images, handleRemoveImage} = this.props
    return (
      <Form.Field>
        <label>Images</label>
        <Segment>
          <Button as="label" htmlFor="file">
            <Icon name='upload'/>
            Upload Image
            <Input
              type="file"
              id="file"
              onChange={(e) => this.processImageChange(e)}
              style={{display: 'none'}}
            />
          </Button>
          <Segment basic style={{paddingLeft: 0}}>
            {images.length === 0 && 'Please upload an image.'}
            <div className='image-container'>
            {images.map((image, i) => {
              return (
                <Segment key={i} compact padded className='image-segment'>
                  <Image src={image.image_src.url} size='small' className='uploaded-image'/>
                  <Icon
                    className='image-remove-icon'
                    name='remove circle'
                    color='red'
                    onClick={() => handleRemoveImage(image.image_src.url)}
                  />
                </Segment>
              )
            })
            }
            </div>
          </Segment>
        </Segment>
      </Form.Field>
    );
  }
}

ImageUpload.propTypes = {
  images: PropTypes.array.isRequired,
  handleAddImage: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired
};

export default ImageUpload
