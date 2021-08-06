import React, { Fragment } from 'react';
import _ from 'lodash';
import { ServiceContext } from '../contexts/ServiceContext.js';
import sharedStyles from '../styles/services/shared.module.css';
import serviceStyles from '../styles/services/iothub.module.css';

const SERVICE_ID = 'IoTHub';

// Place service specific constants here
const tiers_hub = ['free', 'b1', 'b2', 'b3', 's1', 's2', 's3'];

class IoTHub extends React.Component {
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

    if (serviceRegistered && (lastSynced < lastUpdated)) {
      // Update internal expense model here
      const basic_viable = message_count_day_c2d === 0;

      const messages_day_free_tier_eligible = (Math.ceil(questions.message_size_d2c_kb.value / 0.5) * questions.message_count_day_d2c.value + Math.ceil(questions.message_size_c2d_kb.value / 0.5) * questions.message_count_day_c2d.value) * questions.device_count.value;

      const hub = {
        price: {
          free: 0,
          b1: 10 * (Math.floor(outputs.messages_day / 400000.0) + 1),
          b2: 50 * (Math.floor(outputs.messages_day / 6000000.0) + 1),
          b3: 500 * (Math.floor(outputs.messages_day / 300000000.0) + 1),
          s1: 25 * (Math.floor(outputs.messages_day / 400000.0) + 1),
          s2: 250 * (Math.floor(outputs.messages_day / 6000000.0) + 1),
          s3: 2500 * (Math.floor(outputs.messages_day / 300000000.0) + 1),
        },
        viable: {
          free: messages_day_free_tier_eligible < 8000,
          b1: basic_viable,
          b2: basic_viable,
          b3: basic_viable,
          s1: true,
          s2: true,
          s3: true,
        },
      };

      this.setState({
        lastSynced: thisUpdateTime,
      }, () => {
        if (!_.isEqual(outputs.hub, hub)) {
          this.context.updateOutputs(
            thisUpdateTime,
            {
              hub,
              messages_day_free_tier_eligible,
            }
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

    // Increment `order` by 10 to leave room for future services to be added in between
    await registerService(
      SERVICE_ID,
      {
        order: 10,
        name: "Azure IoT Hub",
        url_pricing: "https://azure.microsoft.com/en-us/pricing/details/iot-hub/",
      }
    );

    await registerQuestions({
    });

    await registerOutputs({
      hub: {
        price: {
          free: 0,
          b1: 10,
          b2: 50,
          b3: 500,
          s1: 25,
          s2: 250,
          s3: 2500,
        },
        viable: {
          free: true,
          b1: true,
          b2: true,
          b3: true,
          s1: true,
          s2: true,
          s3: true,
        },
      },
      messages_day_free_tier_eligible: 0
    });

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
            Azure IoT Hub
          </h3>
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
                  if (!outputs.hub.viable[tier]) {
                    return <td key={tier} />;
                  }

                  return (
                    <td
                      key={tier} >
                      ${outputs.hub.price[tier]}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
    );
  }
}

IoTHub.contextType = ServiceContext;

export async function getStaticProps(context) {
  return {
    props: {
    },
  };
};

export default IoTHub;
