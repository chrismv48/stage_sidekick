import React from 'react';
import {Button, Form, Icon, Image, Input, Label, Radio, Segment} from "semantic-ui-react";
import PropTypes from 'prop-types'
import './ImageUpload.scss'
import {observer} from "mobx-react";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

const SortableImage = SortableElement(({image, handleChangePrimary, handleRemoveImage}) => {
  return (
    <Segment compact padded className='image-segment'>
      {
        image.primary &&
        <Label color='blue' attached='top left' size='mini'>Primary</Label>
      }
      <Form.Field>
        <Radio
          value={`option${image.id}`}
          onChange={() => handleChangePrimary(image.image_src.url)}
          name='primary-image-radio'
          checked={image.primary}
          label=' '
        />
        <Image
          inline
          src={image.image_src.url}
          size='small'
          className='uploaded-image'
        />
        <Icon
          className='image-remove-icon'
          name='remove circle'
          color='red'
          onClick={() => handleRemoveImage(image.image_src.url)}
        />
      </Form.Field>
    </Segment>
  )
})

const SortableImages = SortableContainer(({images, handleChangePrimary, handleRemoveImage}) => {
  return (
    <div className='image-container'>
      {images.map((image, i) => {
        return (
          <SortableImage
            image={image}
            key={`image-${i}`}
            index={i}
            handleChangePrimary={handleChangePrimary}
            handleRemoveImage={handleRemoveImage}
          />
        )
      })
      }
    </div>
  )
})

@observer
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
    const {images, handleRemoveImage, handleChangePrimary, handleOnSort} = this.props
    return (
      <Form.Field>
        <label>Images</label>
        <Segment>
          <Button as="label" htmlFor="file" primary>
            <Icon name='upload'/>
            Upload Image
            <Input
              type="file"
              id="file"
              onChange={(e) => this.processImageChange(e)}
              style={{display: 'none'}}
            />
          </Button>
          <Segment basic style={{paddingLeft: 0, cursor: 'move'}}>
            {images.length === 0 && 'Please upload an image.'}
            <SortableImages
              images={images}
              handleRemoveImage={handleRemoveImage}
              handleChangePrimary={handleChangePrimary}
              onSortEnd={handleOnSort}
              axis='xy'
              helperClass='sortableHelper'
              distance={5}
            />
          </Segment>
        </Segment>
      </Form.Field>
    );
  }
}

ImageUpload.propTypes = {
  images: PropTypes.array.isRequired,
  handleAddImage: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
  handleChangePrimary: PropTypes.func.isRequired,
  handleOnSort: PropTypes.func.isRequired
};

export default ImageUpload
