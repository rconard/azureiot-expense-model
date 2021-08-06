import Head from 'next/head';
import Link from 'next/link';
import { Component } from 'react';
import fetch from 'isomorphic-unfetch';
import _ from 'lodash';
import { ServiceContext } from '../contexts/ServiceContext.js';

import Devices from '../services/Devices';
import IoTHub from '../services/IoTHub.jsx';

const timePeriods = [{
  value: 0,
  prompt: "None",
}, {
  value: 864000,
  prompt: "10/second",
}, {
  value: 86400,
  prompt: "1/second",
}, {
  value: 14400,
  prompt: "10/minute",
}, {
  value: 1440,
  prompt: "1/minute",
}, {
  value: 240,
  prompt: "10/hour",
}, {
  value: 24,
  prompt: "1/hour",
}, {
  value: 10,
  prompt: "10/day",
}, {
  value: 1,
  prompt: "1/day",
}, {
  value: 0.3333,
  prompt: "10/month",
}, {
  value: 0.0333,
  prompt: "1/month",
}];

const central_settings = {
  messages_included: {
    s0: 400,
    s1: 5000,
    s2: 30000,
  },
};

class Home extends Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      pricing: {},
      device_count: 1,
      device_restart_mo: 2,
      message_count_day_d2c: 1,
      message_count_day_c2d: 1,
      message_size_d2c_kb: 4,
      message_size_c2d_kb: 4,
      adt: true,
      analysis: false,
      duration_hot: 60,
      duration_cold: 300,
    };
  }

  async componentDidMount() {
    const dev = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
    const res = await fetch(dev ? `http://localhost:7071/api/prices?$filter=serviceName eq 'Virtual Machines'` : `/api/retail/prices`);
    const pricingResponse = await res.json();
    await this.context.setPricing(pricingResponse.pricing);
  
    this.setState({
    });
  }

  handleInputChange(event) {
    const target = event.target;
    let value = null;
    if (target.type === 'checkbox') {
      value = target.checked;
    } else if (target.type === 'number') {
      value = parseFloat(target.value);
    } else if (target.type === 'select-one') {
      if (_.isNumber(parseFloat(target.value))) {
        value = parseFloat(target.value);
      } else {
        value = target.value;
      }
    }
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    const {
      pricing,
      questions,
      orderedQuestions,
      updateQuestion,
    } = this.context;
    const {
      device_count,
      device_restart_mo,
      message_count_day_d2c,
      message_count_day_c2d,
      message_size_d2c_kb,
      message_size_c2d_kb,
      adt,
      analysis,
      duration_hot,
      duration_cold,
    } = this.state;

    const messages_day = (Math.ceil(message_size_d2c_kb / 4) * message_count_day_d2c + Math.ceil(message_size_c2d_kb / 4) * message_count_day_c2d) * device_count;
    const messages_day_free = (Math.ceil(message_size_d2c_kb / 0.5) * message_count_day_d2c + Math.ceil(message_size_c2d_kb / 0.5) * message_count_day_c2d) * device_count;
    const messages_month = messages_day * 30;

    const basic_viable = message_count_day_c2d === 0;

    const devices_central_count = Math.max(device_count - 2, 0);

    const tiers_hub = ['free', 'b1', 'b2', 'b3', 's1', 's2', 's3'];
    const tiers_central = ['s0', 's1', 's2'];
    const pricing_model = {
      hub: {
        price: {
          free: 0,
          b1: 10 * (Math.floor(messages_day / 400000.0) + 1),
          b2: 50 * (Math.floor(messages_day / 6000000.0) + 1),
          b3: 500 * (Math.floor(messages_day / 300000000.0) + 1),
          s1: 25 * (Math.floor(messages_day / 400000.0) + 1),
          s2: 250 * (Math.floor(messages_day / 6000000.0) + 1),
          s3: 2500 * (Math.floor(messages_day / 300000000.0) + 1),
        },
        viable: {
          free: messages_day_free < 8000,
          b1: basic_viable,
          b2: basic_viable,
          b3: basic_viable,
          s1: true,
          s2: true,
          s3: true,
        },
        dps: Math.ceil(device_count * device_restart_mo / 1000.0) * 0.123,
      },
      central: {
        s0: devices_central_count * 0.08 + Math.max(messages_month - devices_central_count * central_settings.messages_included.s0 - 2 * central_settings.messages_included.s0, 0) / 1000.0 * 0.07,
        s1: devices_central_count * 0.40 + Math.max(messages_month - devices_central_count * central_settings.messages_included.s1 - 2 * central_settings.messages_included.s1, 0) / 1000.0 * 0.015,
        s2: devices_central_count * 0.70 + Math.max(messages_month - devices_central_count * central_settings.messages_included.s2 - 2 * central_settings.messages_included.s2, 0) / 1000.0 * 0.015,
      },
    };

    console.log(this.context);

    return (
      <div
        className="iot-pricing-explorer" >
        <Head>
          <title>Home | Azure IoT Price Explorer</title>
        </Head>
        <main>
          <div
            className="arch-diagram-container" >
            <div
              className="question-container" >
              {orderedQuestions.map((questionField) => {
                const question = questions[questionField];
                return (
                  <div
                    key={questionField}
                    className="question" >
                    <label
                      htmlFor={questionField} >
                      {question.prompt}
                    </label>
                    {question.promptType === 'number' && (
                      <input
                        id={questionField}
                        name={questionField}
                        type="number"
                        value={question.value}
                        step={question.outputType === 'integer' ? 1 : 0.1}
                        onChange={(event) => {
                          updateQuestion(questionField, question.outputType, event);
                        }} />
                    )}
                    {question.promptType === 'options' && (
                      <select
                        id={questionField}
                        name={questionField}
                        value={question.value}
                        onChange={(event) => {
                          updateQuestion(questionField, question.outputType, event);
                        }} >
                        {question.options.map((option) => {
                          return (
                            <option
                              key={option.prompt}
                              value={option.value} >
                              {option.prompt}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
            <div
              className="arch-diagram" >
              <Devices />
              <IoTHub />
            </div>
          </div>
          <hr />
          <div
            className="arch-diagram-container-deprecated" >
            <div
              className="arch-diagram" >
              <div>
                Things
              </div>
              <div>
                Azure IoT
              </div>
              <div>
                Data Ingest
              </div>
              <div>
                Data Storage
              </div>
              <div>
                Actions
              </div>
              <div>
                <div>
                Devices/Azure IoT Edge
                </div>
                <div>
                  <table>
                    <thead>
                      <tr>
                        <td>Messages/Day</td>
                        <td>Messages/Month</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{messages_day.toLocaleString()}</td>
                        <td>{messages_month.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                Azure IoT Hub/DPS
                <table>
                  <thead>
                    <tr>
                      {tiers_hub.map((tier) => {
                        return (
                          <th
                            key={tier} >
                            {tier}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {tiers_hub.map((tier) => {
                        if (!pricing_model.hub.viable[tier]) {
                          return <td key={tier} />;
                        }

                        return (
                          <td
                            key={tier} >
                            ${pricing_model.hub.price[tier]}
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
                <div>
                  Device Provisioning Service: {pricing_model.hub.dps.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                </div>
                Azure IoT Central
                <table>
                  <thead>
                    <tr>
                      {tiers_central.map((tier) => {
                        return (
                          <th
                            key={tier} >
                            {tier}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {tiers_central.map((tier) => {
                        return (
                          <td
                            key={tier} >
                            {pricing_model.central[tier].toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                Azure Stream Analytics/Azure Functions/Azure Storage
              </div>
              <div>
                Logic Apps/Azure Cosmos DB/Azure Synapse/Azure Machine Learning
                
                Azure Data Explorer
                <table>
                  <thead>
                    <tr>
                      <td>Data (GB)</td>
                      <td>Price</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {tiers_central.map((tier) => {
                        return (
                          <td
                            key={tier} >
                            {pricing_model.central[tier].toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                Business Integrations/Web and Mobile Apps/Power Platform and BI apps
              </div>
            </div>
            <div>
              <label>
                How many devices?
              </label>
              <input
                name="device_count"
                type="number"
                value={device_count}
                onChange={this.handleInputChange} />
            </div>
            <div>
              <label>
                Device to Cloud Rate
              </label>
              <select
                name="message_count_day_d2c"
                value={message_count_day_d2c}
                onChange={this.handleInputChange} >
                {timePeriods.map((period) => {
                  return (
                    <option
                      key={period.prompt}
                      value={period.value} >
                      {period.prompt}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label>
                Cloud to Device Rate
              </label>
              <select
                name="message_count_day_c2d"
                value={message_count_day_c2d}
                onChange={this.handleInputChange} >
                {timePeriods.map((period) => {
                  return (
                    <option
                      key={period.prompt}
                      value={period.value} >
                      {period.prompt}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label>
                How large are the messages from the device to cloud? (kilobytes)
              </label>
              <input
                name="message_size_d2c_kb"
                type="number"
                value={message_size_d2c_kb}
                onChange={this.handleInputChange} />
            </div>
            <div>
              <label>
                How large are the messages from the cloud to device? (kilobytes)
              </label>
              <input
                name="message_size_c2d_kb"
                type="number"
                value={message_size_c2d_kb}
                onChange={this.handleInputChange} />
            </div>
            <div>
              <label>
                How many times does each device restart per month?
              </label>
              <input
                name="device_restart_mo"
                type="number"
                value={device_restart_mo}
                onChange={this.handleInputChange} />
            </div>
            <div>
              <label>
                Do you need persistent state for your devices when they are disconnected?
              </label>
              <input
                name="adt"
                type="checkbox"
                value={adt}
                onChange={this.handleInputChange} />
            </div>
            <div>
              <label>
                Do you need to do analysis on your data?
              </label>
              <input
                name="analysis"
                type="checkbox"
                value={analysis}
                onChange={this.handleInputChange} />
            </div>
            <div>
              <label>
                Days of Hot Storage
              </label>
              <input
                name="duration_hot"
                type="number"
                value={duration_hot}
                onChange={this.handleInputChange} />
            </div>
            <div>
              <label>
              Days of Cold Storage
              </label>
              <input
                name="duration_cold"
                type="number"
                value={duration_cold}
                onChange={this.handleInputChange} />
            </div>
          </div>
          {Object.keys(this.context.pricing).length > 0 && (
            <div
              style={{
                display: 'block',
                height: 100,
                marginTop: 360,
                overflowY: 'scroll',
              }} >
              {JSON.stringify(this.context.pricing, null, 2)}
            </div>
          )}
        </main>
      </div>
    );
  }
}

Home.contextType = ServiceContext;

export async function getStaticProps(context) {
  return {
    props: {
    },
  };
};

export default Home;
