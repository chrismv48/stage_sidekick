import {hideModal} from "./actions";
import {Button, Header, Modal} from "semantic-ui-react";
import {SceneForm} from "../SceneForm/SceneForm";
import * as React from "react";
import * as _ from "lodash";
import {connect} from "react-redux";
import {createResource, modifyResource} from "../../api/actions";

@connect((state, ownProps) => {
  const {
    dispatch,
    scenes = {}
  } = state.entities
  const sceneStaged = _.get(scenes, `staging.${ownProps.sceneId}`, {})
  const success = scenes.success
  return {
    dispatch,
    sceneStaged,
    success
  }
})

export default class SceneModal extends React.Component {

  componentWillReceiveProps(nextProps) {
    const {sceneStaged: newSceneStaged} = nextProps
    const { sceneStaged, success, dispatch } = this.props
    if (success && !_.isEmpty(sceneStaged) && _.isEmpty(newSceneStaged)) { dispatch(hideModal()) }
  }

  handleSceneSubmit = () => {
    const { sceneStaged, sceneId, dispatch } = this.props
    if (sceneId) {
      dispatch(modifyResource('scenes', `scenes/${sceneId}`, sceneStaged))
    }
    else {
      dispatch(createResource('scenes', 'scenes', sceneStaged))
    }
  }

  render() {
    const {sceneId, sceneStaged, dispatch} = this.props

    let iconName = 'add user'
    let modalHeading = 'Add New Scene'
    if (sceneId) {
      iconName = 'edit'
      modalHeading = 'Edit Scene'
    }

    return (
      <Modal
        open={true}
        onClose={() => dispatch(hideModal())}
        closeIcon='close'>
        <Header icon={iconName} content={modalHeading}/>
        <Modal.Content>
          <SceneForm sceneId={sceneId}/>
        </Modal.Content>
        <Modal.Actions>
          <Button primary
                  onClick={this.handleSceneSubmit}
                  disabled={_.isEmpty(sceneStaged)}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
