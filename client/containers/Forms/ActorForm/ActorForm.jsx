import React from 'react';
import {inject, observer} from "mobx-react";
import {computed, createTransformer, observable} from 'mobx'
import {Dimmer, Dropdown, Form, Loader, Segment} from "semantic-ui-react";
import './ActorForm.scss'
import {get, pullAll} from "lodash";
import ImageUpload from "components/ImageUpload/ImageUpload";

@inject("resourceStore", "uiStore") @observer
export class ActorForm extends React.Component {

  @computed get actor() {
    return this.props.resourceStore.actors.find(actor => actor.id === this.props.actorId)
  }

  @computed get actorStaged() {
    return this.props.resourceStore.getStagedResource('actors', this.props.actorId)
  }

  @observable loading = true

  componentDidMount() {
    const {actorId, resourceStore} = this.props
    this.loading = true

    Promise.all([
      resourceStore.loadActors(actorId),
      resourceStore.loadCharacters(),
    ]).then(() => this.loading = false)
  }

  @computed get generateCharacterOptions() {
    const {characters} = this.props.resourceStore
    return characters.map(character => {
      return {
        key: character.id,
        text: character.name,
        value: character.id,
      }
    })
  }

  render() {
    if (this.loading) {
      return (
        <Dimmer active={true} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      )
    }
    const actorImageUrl = get(this.actorStaged, 'display_image.url' || this.actorStaged['display_image'])
    let actorStaged = this.actorStaged

    return (
      <Segment basic>
        <Form>
          <ImageUpload currentImage={actorImageUrl}
                       handleImageChange={(imageUrl) => actorStaged.display_image = imageUrl}/>
          <Form.Field>
            <label>Name</label>
            <input
              value={actorStaged.fullName}
              disabled={true}
            />
          </Form.Field>
          <Form.Field>
            <label>Height</label>
            <input
              value={actorStaged.height || ''}
              onChange={(e) => actorStaged.height = e.target.value}
            />
          </Form.Field>
          <Form.Field>
            <label>Characters</label>
            <Dropdown fluid multiple selection
                      options={this.generateCharacterOptions}
                      value={actorStaged.character_ids.toJS()}
                      onChange={(e, data) => actorStaged.character_ids = data.value}
            />
          </Form.Field>
        </Form>
      </Segment>
    )
  }
}

ActorForm.propTypes = {};


export default ActorForm
