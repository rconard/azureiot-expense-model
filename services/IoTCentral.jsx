import React, { Fragment } from 'react';
import ToggleService from '../components/ToggleService.jsx';
import _ from 'lodash';
import { ServiceContext } from '../contexts/ServiceContext.js';
import sharedStyles from '../styles/services/shared.module.css';
import serviceStyles from '../styles/services/iotcentral.module.css';
import AzureIoTCentralLogo from '../public/logos/Azure_IoT_Central.png';

// Create a String to Identify the Service
const SERVICE_ID = 'IoTCentral';

// Place service specific constants here
const central_settings = {
  messages_included: {
    s0: 400,
    s1: 5000,
    s2: 30000,
  },
};
const tiers_central = ['s0', 's1', 's2'];

class IoTCentral extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastSynced: undefined,
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

    return !_.isEqual(lastSynced, lastUpdated);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      lastUpdated,
      armRegionName,
      questions,
      outputs,
      pricing,
      expenses,
      hashState,
      updateOutputs,
      updateExpense,
    } = this.context;
    const {
      serviceRegistered,
      lastSynced,
      currentPricingRegion,
    } = this.state;

    const initState = hashState(armRegionName, questions, outputs, expenses);

    // Select a productId_skuName_meterName that will verify pricing is loaded for the selected region
    const testProduct = 'DZH318Z0BQD6_Standard_Standard Tier 2';

    // Verify that this service is due for an update
    if (serviceRegistered && !_.isEqual(lastSynced, lastUpdated) && (testProduct in pricing)) {
      // Update internal expense model here
      const devices_central_count = Math.max(questions.device_count.value - 2, 0);

      const central = {
        s0: devices_central_count * pricing['DZH318Z0BQD6_Standard_Standard Tier 0'].unitPrice * 732 + Math.max(outputs.messages_month - devices_central_count * central_settings.messages_included.s0 - 2 * central_settings.messages_included.s0, 0) / 1000.0 * pricing['DZH318Z0BQD6_Standard_Overage Messages ST0'].unitPrice,
        s1: devices_central_count * pricing['DZH318Z0BQD6_Standard_Standard Tier 1'].unitPrice * 732 + Math.max(outputs.messages_month - devices_central_count * central_settings.messages_included.s1 - 2 * central_settings.messages_included.s1, 0) / 1000.0 * pricing['DZH318Z0BQD6_Standard_Overage Messages'].unitPrice,
        s2: devices_central_count * pricing['DZH318Z0BQD6_Standard_Standard Tier 2'].unitPrice * 732 + Math.max(outputs.messages_month - devices_central_count * central_settings.messages_included.s2 - 2 * central_settings.messages_included.s2, 0) / 1000.0 * pricing['DZH318Z0BQD6_Standard_Overage Messages'].unitPrice,
      };

      let expense = central.s2;
      tiers_central.forEach((tier) => {
        if (central[tier] < expense) {
          expense = central[tier];
        }
      });

      // To avoid an infinite update loop, use the same update time
      this.setState({
        lastSynced: initState,
        currentPricingRegion: armRegionName,
      }, async () => {
        // Verify that the inputs result in new outputs
        if (!_.isEqual(outputs.central, central) || !_.isEqual(armRegionName, currentPricingRegion) || !_.isEqual(lastSynced, lastUpdated)) {
          await updateOutputs(
            initState,
            {
              devices_central_count,
              central,
            }
          );
          await updateExpense(
            initState,
            SERVICE_ID,
            expense
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
      logos: Where in the architecture diagram should this service logo be added?
    }
    */
    await registerService(
      SERVICE_ID,
      {
        order: 20,
        name: "IoT Central",
        serviceFamily: "Internet of Things",
        url_pricing: "https://azure.microsoft.com/en-us/pricing/details/iot-central/",
        logos: {
          Devices: [],
          Connectivity: [],
          Messaging: [AzureIoTCentralLogo],
          Provisioning: [AzureIoTCentralLogo],
          RealTime: [AzureIoTCentralLogo],
          Management: [AzureIoTCentralLogo],
          Scaling: [AzureIoTCentralLogo],
          CrossRegion: [AzureIoTCentralLogo],
          Hot: [],
          Warm: [],
          Cold: [],
          Connections: [],
          Integrations: [],
        },
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
    });

    // Initialize the centrally updated variables to allow other services to build on your service
    await registerOutputs({
      central: {
        s0: 0,
        s1: 0,
        s2: 0,
      },
    });

    // Initialize a single expense value from the service
    await registerExpense(
      SERVICE_ID,
      0
    );

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
            IoT Central
          </h3>
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
                      {outputs.central[tier].toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
          <ToggleService
            service={SERVICE_ID} />
        </div>
    );
  }
}

IoTCentral.contextType = ServiceContext;

export async function getStaticProps(context) {
  return {
    props: {
    },
  };
};

export default IoTCentral;
