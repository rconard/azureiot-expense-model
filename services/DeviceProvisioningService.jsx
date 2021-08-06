import React, { Fragment } from 'react';
import _ from 'lodash';
import { ServiceContext } from '../contexts/ServiceContext.js';
import sharedStyles from '../styles/services/shared.module.css';
import serviceStyles from '../styles/services/deviceprovisioningservice.module.css';

// Create a String to Identify the Service
const SERVICE_ID = 'DeviceProvisioningService';

// Place service specific constants here

class DeviceProvisioningService extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastSynced: 0,
      serviceRegistered: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      lastUpdated,
    } = this.context;
    const {
      lastSynced,
    } = this.state;

    return lastSynced < lastUpdated;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const thisUpdateTime = performance.now();
    const {
      lastUpdated,
      questions,
      outputs,
    } = this.context;
    const {
      serviceRegistered,
      lastSynced,
    } = this.state;

    // Verify that this service is due for an update
    if (serviceRegistered && (lastSynced < lastUpdated)) {
      // Update internal expense model here
      const dps_hits_month = questions.device_count.value * questions.device_restart_mo.value;
      const dps_expense = Math.ceil(dps_hits_month / 1000.0) * 0.123;

      // To avoid an infinite update loop, use the same update time
      this.setState({
        lastSynced: thisUpdateTime,
      }, async () => {
        // Verify that the inputs result in new outputs
        if (!_.isEqual(outputs.dps_hits_month, dps_hits_month)) {
          await this.context.updateOutputs(
            thisUpdateTime,
            {
              dps_hits_month,
            }
          );
          await this.context.updateExpense(
            thisUpdateTime,
            SERVICE_ID,
            dps_expense
          );
        }
      });
    }
  }

  async componentDidMount() {
    const {
      registerService,
      registerQuestions,
      registerOutputs,
      registerExpense,
    } = this.context;

    // Initialize the service
    //// Increment `order` by 10 to leave room for future services to be added in between
    await registerService(
      SERVICE_ID,
      {
        order: 12,
        name: "IoT Hub Device Provisioning Service",
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
      device_restart_mo: {
        parent: SERVICE_ID,
        serviceQuestionOrder: 0,
        prompt: "How many times does each device restart per month?",
        promptType: "number",
        outputType: "integer",
        value: 2,
      },
    });

    // Initialize the centrally updated variables to allow other services to build on your service
    await registerOutputs({
      dps_hits_month: 0,
    });

    // Initialize a single expense value from the service
    await registerExpense(
      SERVICE_ID,
      0
    );

    this.setState({
      serviceRegistered: true,
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
            IoT Hub Device Provisioning Service
          </h3>
          <table>
            <thead>
              <tr>
                <th>
                  DPS Requests/Month
                </th>
                <th>
                  Expense
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {(questions.device_count.value * questions.device_restart_mo.value).toLocaleString()}
                </td>
                <td>
                  {expenses[SERVICE_ID].toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
    );
  }
}

DeviceProvisioningService.contextType = ServiceContext;

export async function getStaticProps(context) {
  return {
    props: {
    },
  };
};

export default DeviceProvisioningService;
