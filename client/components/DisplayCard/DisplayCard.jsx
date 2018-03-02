import React from 'react';
import {Card, Icon, Image} from "semantic-ui-react";
import './DisplayCard.scss'
import classNames from 'classnames'
import {SortableHandle} from "react-sortable-hoc";
import PropTypes from 'prop-types'


const DragHandle = SortableHandle(() => <Icon size='large' style={{height: 'initial', cursor: 'move'}} name="move"
                                              className="card-edit-icon"/>)

class DisplayCard extends React.Component {

  state = {
    showHoverState: false,
  }

  renderEditBar = () => {
    const {onEditCallback, onDeleteCallback, label, sortable = true} = this.props
    return (
      <div className={'card-edit-panel'}>
        {sortable && <DragHandle/>}
        <div className="card-edit-icons">
          <Icon name="edit" size='large' onClick={onEditCallback} className="card-edit-icon"/>
          <Icon name="trash" size='large' onClick={onDeleteCallback} className="card-edit-icon"/>
        </div>
      </div>
    )
  }

  render() {
    const {showEditBar, cardImage, header, meta, frontDescription, backDescription, extra, link, handleOnClick, flipped, index, sortable} = this.props
    const {showHoverState} = this.state
    return (
      <Card
        raised
        className={classNames("DisplayCard", {'hover': showHoverState})}
        // href={link}
        onMouseEnter={() => this.setState({showHoverState: true})}
        onMouseLeave={() => this.setState({showHoverState: false})}
        onClick={() => handleOnClick()}
      >
        {
          showEditBar &&
          <div className="overlay">
            {this.renderEditBar()}
          </div>
        }
        <Image src={cardImage}/>
        <Card.Content>
          <Card.Header>
            {header}
          </Card.Header>
          <Card.Meta>
            {meta}
          </Card.Meta>
          <Card.Description className='card-description'>
            <div className={classNames('front-description', {'hidden': flipped})}>
              {frontDescription}
            </div>
            <div className={classNames('back-description', {'hidden': !flipped})}>
              {backDescription}
            </div>
          </Card.Description>
        </Card.Content>
        {
          extra &&
          <Card.Content extra>
            {extra}
          </Card.Content>
        }

      </Card>
    );
  }
}

DisplayCard.propTypes = {
  cardImage: PropTypes.string,
  showEditBar: PropTypes.bool,
  header: PropTypes.string.isRequired,
  frontDescription: PropTypes.string,
  onEditCallback: PropTypes.func,
  onDeleteCallback: PropTypes.func,
  label: PropTypes.string,
  handleOnClick: PropTypes.func,
  sortable: PropTypes.bool,
  link: PropTypes.string
};

export default DisplayCard
