import React, { Fragment } from 'react';
import Toggle from 'react-toggle';
import _ from 'lodash';
import { ServiceContext } from '../contexts/ServiceContext.js';
import sharedStyles from '../styles/services/shared.module.css';
import 'react-toggle/style.css';

class ToggleService extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      toggleServiceEnabled,
      enabledServices,
    } = this.context;
    const {
      service,
    } = this.props;

    return (
      <div
        className={sharedStyles['service-toggler-container']} >
          <Toggle
            id={'service-selected-' + service}
            defaultChecked={enabledServices.indexOf(service) > -1}
            onChange={() => toggleServiceEnabled(service)} />
          <label htmlFor='service-selected'>Service Selected</label>
      </div>
    );
  }
}

ToggleService.contextType = ServiceContext;

export async function getStaticProps(context) {
  return {
    props: {
    },
  };
};

export default ToggleService;
