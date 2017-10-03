import React from 'react';
import {Card} from "semantic-ui-react";
import './CardGroup.scss'
import {SortableContainer} from 'react-sortable-hoc'
import {connect} from "react-redux";
import {swapResourceOrderIndex} from "../../api/actions";


const SortableCardGroup = SortableContainer(({children, ...rest}) => {
  return (
    <Card.Group {...rest}>
      {children}
    </Card.Group>
  )
})

@connect(state => {
  const { dispatch } = state
  return { dispatch }
})

class CardGroup extends React.Component { // eslint-disable-line react/prefer-stateless-function

  handleOnSortEnd = ({oldIndex, newIndex}) => {
    const { resource, dispatch } = this.props
    dispatch(swapResourceOrderIndex(resource, oldIndex, newIndex))
  }

  render() {
    const { children, ...rest } = this.props
    return (
      <SortableCardGroup {...rest} onSortEnd={this.handleOnSortEnd} axis='xy' useDragHandle={true}>
        {children}
      </SortableCardGroup>
    );
  }
}

CardGroup.propTypes = {};

export default CardGroup
