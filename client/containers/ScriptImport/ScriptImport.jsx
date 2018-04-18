import React from 'react';
import './ScriptImport.scss'
import {Button, Divider, Grid, Icon, Input,} from 'semantic-ui-react'
import {inject, observer} from "mobx-react/index";
import {computed, observable} from "mobx";
import ContentLoader from "components/ContentLoader/ContentLoader";
import CandidateSelection from "containers/ScriptImport/CandidateSelection";

@inject("resourceStore", "uiStore") @observer
export class ScriptImport extends React.Component {

  @observable loading =  false
  @observable scriptInput = null

  processUpload(e) {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.loading = true
      this.scriptInput = {payload: reader.result, format: 'pdf'}
      this.props.resourceStore.parseScript(this.scriptInput).then(() => this.loading = false)
    }

    reader.readAsDataURL(file)
  }

  render() {
    const {scriptOptions} = this.props.resourceStore
    return (
      <Grid className="ScriptImport">
        <Grid.Column>
          <h2>Import Script</h2>
              <Button as="label" htmlFor="file" primary>
                <Icon name='upload'/>
                Upload PDF
                <Input
                  type="file"
                  id="file"
                  onChange={(e) => this.processUpload(e)}
                  style={{display: 'none'}}
                />
              </Button>
          {this.loading && <ContentLoader/>}
          {scriptOptions &&
          <React.Fragment>
            <Divider/>
            <CandidateSelection scriptInput={this.scriptInput}/>
          </React.Fragment>
          }

        </Grid.Column>
      </Grid>
    );
  }
}

export default ScriptImport;
