import React from 'react';
import './ImgLightbox.scss'
import PropTypes from 'prop-types'
import Lightbox from 'react-images'
import {observable} from "mobx";
import {observer} from "mobx-react/index";

@observer
class ImgLightbox extends React.Component {

  @observable currentImage = 0

  generateLightBoxImages() {
    return this.props.images.map(image => {
      return { src: image.image_src.url }
    })
  }

  handleOnClickNext = () => {
    this.currentImage++
  }

  handleOnClickPrev = () => {
    this.currentImage--
  }

  render() {
    const { isOpen, handleOnClose } = this.props
    return (
      <Lightbox
        images={this.generateLightBoxImages()}
        isOpen={isOpen}
        onClose={handleOnClose}
        onClickNext={this.handleOnClickNext}
        onClickPrev={this.handleOnClickPrev}
        currentImage={this.currentImage}
      />
    )
  }
}


ImgLightbox.propTypes = {
  images: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleOnClose: PropTypes.func.isRequired,
};

export default ImgLightbox
