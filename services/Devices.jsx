import React, { Fragment } from 'react';
import _ from 'lodash';
import { ServiceContext } from '../contexts/ServiceContext.js';
import sharedStyles from '../styles/services/shared.module.css';
import serviceStyles from '../styles/services/devices.module.css';

const SERVICE_ID = 'Devices';

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

class Devices extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questionState: {},
      serviceRegistered: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      questions,
    } = this.context;
    const {
      questionState,
    } = this.state;

    const myQuestions = _.pickBy(questions, (question) => {
      return question.parent === SERVICE_ID;
    });

    return !_.isEqual(myQuestions, questionState);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      questions,
    } = this.context;
    const {
      serviceRegistered,
    } = this.state;

    if (serviceRegistered) {
      // Update internal expense model here
      const messages_day = (Math.ceil(questions.message_size_d2c_kb.value / 4) * questions.message_count_day_d2c.value + Math.ceil(questions.message_size_c2d_kb.value / 4) * questions.message_count_day_c2d.value) * questions.device_count.value;

      this.context.updateOutputs({
        messages_day,
        messages_month: messages_day * 30,
      });
    }

    // Update internal state for shouldComponentMount logic
    const myQuestions = _.pickBy(questions, (question) => {
      return question.parent === SERVICE_ID;
    });

    this.setState({
      questionState: myQuestions,
    });
  }

  async componentDidMount() {
    await this.context.registerService(
      SERVICE_ID,
      {
        order: 0,
        name: "Devices",
        url_pricing: "https://azure.microsoft.com/en-us/pricing/details/iot-hub/",
      }
    );

    await this.context.registerQuestions({
      device_count: {
        parent: SERVICE_ID,
        serviceQuestionOrder: 0,
        prompt: "How many devices will you connect?",
        promptType: "number",
        outputType: "integer",
        value: 1,
      },
      message_count_day_d2c: {
        parent: SERVICE_ID,
        serviceQuestionOrder: 1,
        prompt: "How many messages will the device send?",
        promptType: "options",
        outputType: "integer",
        value: 1,
        options: timePeriods,
      },
      message_count_day_c2d: {
        parent: SERVICE_ID,
        serviceQuestionOrder: 2,
        prompt: "How many messages will you send the device?",
        promptType: "options",
        outputType: "integer",
        value: 1,
        options: timePeriods,
      },
      message_size_d2c_kb: {
        parent: SERVICE_ID,
        serviceQuestionOrder: 3,
        prompt: "How large are the messages from the device to cloud? (kilobytes)",
        promptType: "number",
        outputType: "integer",
        value: 4,
      },
      message_size_c2d_kb: {
        parent: SERVICE_ID,
        serviceQuestionOrder: 4,
        prompt: "How large are the messages from the cloud to device? (kilobytes)",
        promptType: "number",
        outputType: "integer",
        value: 4,
      }
    });

    this.context.registerOutputs({
      messages_day: 0,
      messages_month: 0,
    });

    this.setState({
      serviceRegistered: true,
    });
  }

  render() {
    const {
      outputs,
    } = this.context;
    const {
      serviceRegistered,
    } = this.state;

    if (!serviceRegistered) {
      return null;
    }

    return (
        <div
          className={sharedStyles['service-container']} >
          <h3
            className={sharedStyles['service-name']} >
            Devices
          </h3>
          <table>
            <thead>
              <tr>
                <td>Messages/Day</td>
                <td>Messages/Month</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{outputs.messages_day.toLocaleString()}</td>
                <td>{outputs.messages_month.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
    );
  }
}

Devices.contextType = ServiceContext;

export async function getStaticProps(context) {
  return {
    props: {
    },
  };
};

export default Devices;
