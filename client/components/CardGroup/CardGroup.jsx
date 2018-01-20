import React from 'react';
import {Card} from "semantic-ui-react";
import './CardGroup.scss'
import {SortableContainer, SortableElement} from 'react-sortable-hoc'
import {inject, observer} from "mobx-react/index";

const SortableCard = SortableElement(({children}) => children)
const SortableCardGroup = SortableContainer(({children}) => children)

@inject("resourceStore") @observer
class CardGroup extends React.Component {

  handleOnSortEnd = ({oldIndex, newIndex}) => {
    if (oldIndex === newIndex) return
    const {resource, resourceStore} = this.props
    resourceStore.updateOrderIndex(resource, oldIndex, newIndex)
  }

  renderSortableChildren = (children) => {
    return React.Children.map(children, (child, i) => {
      const sortableChild = React.cloneElement(child, {sortable: true})
      return (
        <SortableCard index={i}>
          {sortableChild}
        </SortableCard>
      )
    })
  }

  render() {
    const {children, sortable, resourceStore, ...rest} = this.props

    if (sortable) {
      return (
        <SortableCardGroup onSortEnd={this.handleOnSortEnd} axis='xy' useDragHandle={true}>
          <Card.Group {...rest}>
            {this.renderSortableChildren(children)}
          </Card.Group>
        </SortableCardGroup>
      )
    }
    else {
      return (
        <Card.Group {...rest}>
          {children}
        </Card.Group>
      );
    }
  }
}

CardGroup.propTypes = {};

export default CardGroup
