import React from 'react';
import {Image, Input, Segment} from "semantic-ui-react";
import './ImageUpload.scss'

class ImageUpload extends React.Component { // eslint-disable-line react/prefer-stateless-function

  processImageChange(e) {
    const { handleImageChange } = this.props

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      handleImageChange(reader.result)
      // this.setState({
      //   file: file,
      //   imagePreviewUrl: reader.result
      // });
    }

    reader.readAsDataURL(file)
  }

  render() {
    let {currentImage} = this.props;
    let imagePreview = null;
    if (currentImage) {
      imagePreview = (<Image src={currentImage}/>);
    } else {
      imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }
    return (
      <Segment>
        <Input
          type="file"
          onChange={(e) => this.processImageChange(e)}/>
        <div className="imgPreview">
          {imagePreview}
        </div>
      </Segment>
    );
  }
}

ImageUpload.propTypes = {};

export default ImageUpload
