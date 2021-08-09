///////////////////////////////////////////
// Do Not Use This Service as a Template //
///////////////////////////////////////////

import React, { Fragment } from 'react';
import _ from 'lodash';
import { ServiceContext } from '../contexts/ServiceContext.js';
import sharedStyles from '../styles/services/shared.module.css';
import serviceStyles from '../styles/services/devices.module.css';

// Create a String to Identify the Service
const SERVICE_ID = 'Devices';

// Place service specific constants here
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
      lastSynced: undefined,
      serviceRegistered: false,
      currentPricingRegion: undefined,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      lastUpdated,
    } = this.context;
    const {
      lastSynced,
    } = this.state;

    return !_.isEqual(lastSynced, lastUpdated);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const thisUpdateTime = performance.now();
    const {
      lastUpdated,
      armRegionName,
      questions,
      outputs,
      expenses,
      hashState,
      updateOutputs,
    } = this.context;
    const {
      serviceRegistered,
      lastSynced,
      currentPricingRegion,
    } = this.state;

    const initState = hashState(armRegionName, questions, outputs, expenses);

    // Verify that this service is due for an update
    if (serviceRegistered && !_.isEqual(lastSynced, lastUpdated)) {
      // Update internal expense model here
      const messages_day = (Math.ceil(questions.message_size_d2c_kb.value / 4) * questions.message_count_day_d2c.value + Math.ceil(questions.message_size_c2d_kb.value / 4) * questions.message_count_day_c2d.value) * questions.device_count.value;

      // To avoid an infinite update loop, use the same update time
      this.setState({
        lastSynced: initState,
        currentPricingRegion: armRegionName,
      }, async () => {
        // Verify that the inputs result in new outputs
        if (!_.isEqual(outputs.messages_day, messages_day) || !_.isEqual(armRegionName, currentPricingRegion) || !_.isEqual(lastSynced, lastUpdated)) {
          await updateOutputs(
            initState,
            {
              messages_day,
              messages_month: messages_day * 30,
            }
          );
        }
      });
    }
  }

  async componentDidMount() {
    const {
      registerService,
      registerServiceAck,
      registerQuestions,
      registerOutputs,
      registerExpense,
    } = this.context;

    // Initialize the service
    /*
    {
      order: The user prompts will appear in the order specified by this value
             Increment `order` by 10 to leave room for future services to be added in between
      name: Display name of the service for end users
      serviceFamily: Provide the ARM serviceFamily used in the pricing API call
                     https://docs.microsoft.com/en-us/rest/api/cost-management/retail-prices/azure-retail-prices
      url_pricing: Webpage where the user can find details on the service pricing
    }
    */
    await registerService(
      SERVICE_ID,
      {
        order: 0,
        name: "Devices",
        serviceFamily: "Internet of Things",
        url_pricing: "https://azure.microsoft.com/en-us/pricing/details/iot-hub/",
      }
    );

    // Submit questions to the questionairre
    /* 
    easily_identifiable_variable_name: {
      parent: this service,
      serviceQuestionOrder: the questions will be organized together by this value,
      prompt: question text,
      promptType: select the input type,
      outputType: the output will be cast,
      value: initialize the value,
    }
    */
    await registerQuestions({
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

    // Initialize the centrally updated variables to allow other services to build on your service
    await registerOutputs({
      messages_day: 0,
      messages_month: 0,
    });

    // This service does not incur expenses
    // await registerExpense(
    //   SERVICE_ID,
    //   0
    // );

    this.setState({
      serviceRegistered: true,
    }, () => {
      registerServiceAck();
    });
  }

  render() {
    const {
      questions,
      outputs,
      expenses,
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
