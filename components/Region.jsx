///////////////////////////////////////////
// Do Not Use This Service as a Template //
///////////////////////////////////////////

import React, { Fragment } from 'react';
import _ from 'lodash';
import { ServiceContext } from '../contexts/ServiceContext.js';
import sharedStyles from '../styles/services/shared.module.css';

// Create a String to Identify the Service
const SERVICE_ID = 'Region';

class Region extends React.Component {
  constructor(props) {
    super(props);

    this.sendUpdateRegion = this.sendUpdateRegion.bind(this);

    this.state = {
      dev: false,
      iotRegions: []
    };
  }

  async componentDidMount() {
    const {
      armRegionName,
    } = this.context;

    const dev = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
    const requestIoTHubRegions = await fetch(dev ? `http://localhost:7071/api/prices?$filter=serviceName eq 'IoT Hub' and skuName eq 'S1'` : `/api/prices`);
    const responseIoTHubRegions = await requestIoTHubRegions.json();

    const iotRegions = _.chain(responseIoTHubRegions.pricing.Items)
      .uniqBy('armRegionName')
      .map((item) => {
        return {armRegionName: item.armRegionName, location: item.location};
      })
      .sortBy('location')
      .value();
    
    // Initialize default region
    this.sendUpdateRegion(armRegionName);
    
    this.setState({
      dev,
      iotRegions,
    });
  }

  async sendUpdateRegion(armRegionName) {
    const {
      updateRegion,
    } = this.context;
    
    await updateRegion(armRegionName);
  }

  render() {
    const {
      armRegionName,
      questions,
      outputs,
      expenses,
    } = this.context;
    const {
      iotRegions,
    } = this.state;

    return (
      <div
        className="question" >
        <label>
          Select Your Region
        </label>
        <select
          id="armRegionName"
          name="armRegionName"
          value={armRegionName}
          onChange={(event) => {
            const target = event.target;
            const armRegionName = target.type === 'checkbox' ? target.checked : target.value;

            this.sendUpdateRegion(armRegionName);
          }} >
          {iotRegions.map((region) => {
            return (
              <option
                key={region.armRegionName}
                value={region.armRegionName} >
                {region.location}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}

Region.contextType = ServiceContext;

export async function getStaticProps(context) {
  return {
    props: {
    },
  };
};

export default Region;
