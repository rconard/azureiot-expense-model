import Head from 'next/head';
import Link from 'next/link';
import { Component } from 'react';
import fetch from 'isomorphic-unfetch';
import _ from 'lodash';
import { ServiceContext } from '../contexts/ServiceContext.js';

import Devices from '../services/Devices';
import IoTHub from '../services/IoTHub.jsx';
import DeviceProvisioningService from '../services/DeviceProvisioningService.jsx';
import Region from '../components/Region.jsx';
import IoTCentral from '../services/IoTCentral.jsx';

class Home extends Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
    };
  }

  async componentDidMount() {
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
      registry,
      orderedServices,
      pricing,
      questions,
      expenses,
      orderedQuestions,
      updateQuestion,
    } = this.context;
    const {
    } = this.state;

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
              <Region />
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
              <DeviceProvisioningService />
              <IoTCentral />
            </div>
            <div
              className="expense-table" >
              {orderedServices.map((service) => {
                if (service in expenses) {
                  return (
                    <div
                      className="expense-service-container" >
                      <div
                        className="expense-service-name" >
                        {registry[service].name}
                      </div>
                      <div
                        className="expense-service-expense" >
                        {expenses[service].toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                      </div>
                    </div>
                  );
                } else {
                  return false;
                }
              })}
            </div>
          </div>
          <hr />
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
