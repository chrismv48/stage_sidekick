import React from 'react';
import {Button, Comment, Form} from "semantic-ui-react";
import './CommentFeed.scss'
import PropTypes from 'prop-types'
import DisplayComment from 'components/Comment/Comment'
import {computed, observable} from "mobx";
import {inject, observer} from "mobx-react";
import {cloneDeep, orderBy} from 'lodash'

@inject("resourceStore", "uiStore") @observer
class CommentFeed extends React.Component {

  @observable newComment = ''
  @observable editingComment = null

  @computed get resource() {
    const { resource, resourceId, resourceStore } = this.props
    return resourceStore.getStagedResource(resource, resourceId)
  }

  handleAddComment() {
    this.resource.addComment(this.newComment)
    this.newComment = ''
  }

  handleRemoveComment(commentId) {
    this.resource.removeComment(commentId)
  }

  handleEditComment(commentId) {
    this.editingComment = commentId
  }

  handleSaveChange() {
    this.resource.save()
    this.editingComment = null
  }

  handleDiscardChanges() {
    this.resource.revert()
    this.editingComment = null
  }

  handleOnChange(commentId, newValue) {
    const comments = cloneDeep(this.resource.comments.slice())
    let comment = comments.find(comment => commentId === comment.id)
    comment.content = newValue
    this.resource.comments = comments
  }

  render() {
    return (
      <Comment.Group>
        {orderBy(this.resource.comments, 'id', 'asc').map(comment =>
          <DisplayComment
            key={comment.id}
            comment={comment}
            handleRemove={() => this.handleRemoveComment(comment.id)}
            handleEdit={() => this.handleEditComment(comment.id)}
            handleSaveChange={() => this.handleSaveChange()}
            handleDiscardChanges={() => this.handleDiscardChanges()}
            handleOnChange={(newValue) => this.handleOnChange(comment.id, newValue)}
            editMode={comment.id === this.editingComment}
          />
        )}
        <Form reply>
          <Form.TextArea
            value={this.newComment}
            onChange={e => this.newComment = e.target.value}
          />
          <Button
            content='Add Comment'
            labelPosition='left'
            icon='edit'
            primary
            onClick={() => this.handleAddComment()}
          />
        </Form>
      </Comment.Group>
    )
  }
}

CommentFeed.propTypes = {
  resource: PropTypes.string.isRequired,
  resourceId: PropTypes.number.isRequired,
};

export default CommentFeed
