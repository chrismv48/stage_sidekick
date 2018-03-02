import React from 'react';
import PropTypes from 'prop-types'
import './Comment.scss'
import {inject, observer} from "mobx-react";
import {Button, Comment, Form} from "semantic-ui-react";
import {computed} from "mobx";
import moment from 'moment'

@inject("resourceStore", "uiStore") @observer
class DisplayComment extends React.Component {

  @computed get role() {
    const {comment: {role_id}, resourceStore: {roles}} = this.props
    return roles.find(role => role_id === role.id)
  }

  render() {
    const {
      comment,
      handleRemove,
      handleEdit,
      handleSaveChange,
      handleDiscardChanges,
      handleOnChange,
      editMode
    } = this.props
    return (
      <Comment className='Comment'>
        <Comment.Avatar src={this.role.avatar}/>
        <Comment.Content>
          <Comment.Author as='a'>
            <a href={`/roles/${this.role.id}`}>{this.role.fullName}</a>
          </Comment.Author>
          <Comment.Metadata>
            <div>{moment(comment.created_at).fromNow()}</div>
          </Comment.Metadata>
          <Comment.Text>
            {editMode ?
              <Form reply>
                <Form.TextArea
                  value={comment.content}
                  onChange={e => handleOnChange(e.target.value)}
                />
                <Button
                  primary
                  type='submit'
                  onClick={() => handleSaveChange()}
                >
                  Save
                </Button>
                <span
                  className='discard'
                  onClick={() => handleDiscardChanges()}
                >
                  Discard
                </span>
              </Form>
              : comment.content
            }
          </Comment.Text>
          {!editMode &&
          <Comment.Actions>
            <Comment.Action
              onClick={() => handleEdit()}
            >
              Edit
            </Comment.Action>
            <Comment.Action
              onClick={() => handleRemove()}>
              Delete
            </Comment.Action>
          </Comment.Actions>
          }
        </Comment.Content>
      </Comment>
    )
  }
}

DisplayComment.propTypes = {
  comment: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleSaveChange: PropTypes.func.isRequired,
  handleDiscardChanges: PropTypes.func.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  editMode: PropTypes.bool
};

DisplayComment.defaultProps = {
  editMode: false
}

export default DisplayComment
