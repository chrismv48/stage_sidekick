import React from 'react';
import {connect} from 'react-redux';
import {Dimmer, Dropdown, Form, Loader, Segment} from "semantic-ui-react";
import './CostumeItemForm.scss'
import * as _ from "lodash";
import {fetchResource, updateResourceFields} from "api/actions";
import ImageUpload from "components/ImageUpload/ImageUpload";

const itemTypes = [
  'Shirt',
  'Pants',
  'Jacket',
  'Shoes',
  'Hat',
  'Belt'
]

@connect((state, ownProps) => {
  const {dispatch} = state
  const {costumeItemId} = ownProps
  const {
    costumes: {byId: costumesById = {}, allIds: costumesAllIds = []} = {},
    costume_items = {},
  } = state.resources

  const costumeItem = _.get(costume_items, `byId.${costumeItemId}`, {})
  const costumeItemStaging = _.get(costume_items, `staging.${costumeItemId}`, {})
  const loading = costume_items.loading

  return {
    dispatch,
    costumeItem,
    costumeItemStaging,
    loading,
    costumesById,
    costumesAllIds,
  }
})

export class CostumeItemForm extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentDidMount() {
    const {costumeItemId, dispatch} = this.props
    if (costumeItemId) {
      dispatch(fetchResource('costume_items', `costume_items/${costumeItemId}`))
    }
    dispatch(fetchResource('costumes', 'costumes'))
  }

  generateCostumeOptions = () => {
    const {costumesById, costumesAllIds} = this.props
    return costumesAllIds.map(costumeId => {
      const costume = costumesById[costumeId]
      return {
        key: costume.id,
        text: costume.title,
        value: costume.id,
      }
    })
  }

  handleCostumeSelection = (event, data) => {
    this.props.dispatch(updateResourceFields('costume_items', 'costume_id', data.value, this.props.costumeItemId))
  }

  handleItemTypeSelection = (event, data) => {
    this.props.dispatch(updateResourceFields('costume_items', 'item_type', data.value, this.props.costumeItemId))
  }

  render() {
    const {costumeItemStaging = {}, costumeItem = {}, dispatch, loading, costumeItemId, costumesById, costumesAllIds} = this.props
    const costumeItemImageUrl = costumeItemStaging['display_image'] || _.get(costumeItem, 'display_image.url')
    const itemTypeOptions = itemTypes.map(itemType => {
      return {key: itemType, text: itemType, value: itemType}
    })
    return (
      <Segment basic>
        <Dimmer active={loading} inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
        <Form>
          <ImageUpload currentImage={costumeItemImageUrl}
                       handleImageChange={(imageUrl) => dispatch(updateResourceFields('costume_items', 'display_image', imageUrl, costumeItemId))}/>
          <Form.Field>
            <label>Title</label>
            <input
              value={_.isUndefined(costumeItemStaging['title']) ? costumeItem.title : costumeItemStaging['title'] || ""}
              onChange={(e) => dispatch(updateResourceFields('costume_items', 'title', e.target.value, costumeItemId))}/>
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <textarea
              value={_.isUndefined(costumeItemStaging['description']) ? costumeItem.description : costumeItemStaging['description'] || ""}
              onChange={(e) => dispatch(updateResourceFields('costume_items', 'description', e.target.value, costumeItemId))}
            />
          </Form.Field>
          <Form.Field>
            <label>Type</label>
            <Dropdown placeholder='Select Item Type' fluid selection
                      options={itemTypeOptions}
                      value={costumeItemStaging['item_type'] || costumeItem.item_type || ''}
                      onChange={(event, data) => this.handleItemTypeSelection(event, data)}
            />
          </Form.Field>
          <Form.Field>
            <label>Costumes</label>
            <Dropdown placeholder='Costumes' fluid selection
                      options={this.generateCostumeOptions()}
                      value={costumeItemStaging['costume_id'] || costumeItem.costume_id || ''}
                      onChange={(event, data) => this.handleCostumeSelection(event, data)}
            />
          </Form.Field>
        </Form>
      </Segment>
    )
  }
}


export default CostumeItemForm
