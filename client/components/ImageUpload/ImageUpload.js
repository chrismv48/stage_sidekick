import React from 'react';
import {Button, Form, Icon, Image, Input, Segment} from "semantic-ui-react";

class ImageUpload extends React.Component { // eslint-disable-line react/prefer-stateless-function

  processImageChange(e) {
    const { handleImageChange } = this.props

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      handleImageChange(reader.result)
    }

    reader.readAsDataURL(file)
  }

  render() {
    let {currentImage} = this.props;
    let imagePreview = null;
    if (currentImage) {
      imagePreview = (<Image src={currentImage} style={{maxWidth: '400px'}} />);
    } else {
      imagePreview = (<div>Please select an image to preview</div>);
    }
    return (
      <Form.Field>
        <label>Image</label>
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
          {imagePreview}
          </Segment>
        </Segment>
      </Form.Field>
    );
  }
}

ImageUpload.propTypes = {};

export default ImageUpload
