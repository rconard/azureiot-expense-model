import React, { Fragment } from 'react';
import _ from 'lodash';
import ToggleService from '../components/ToggleService.jsx';
import { ServiceContext } from '../contexts/ServiceContext.js';
import sharedStyles from '../styles/services/shared.module.css';
import serviceStyles from '../styles/services/eventhub.module.css';

// Create a String to Identify the Service
const SERVICE_ID = 'EventHub';

// Place service specific constants here
const tiers_hub = ['basic', 'standard'];

class EventHub extends React.Component {
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
    const testProduct = 'DZH318Z0BQFF_Basic_Basic Throughput Unit';

    // Verify that this service is due for an update
    if (serviceRegistered && !_.isEqual(lastSynced, lastUpdated) && (testProduct in pricing)) {
      // Update internal expense model here
      const kafka_support = questions.event_hub_kafka_support.value;

      const ingress_data_day_KB = questions.message_size_d2c_kb.value * questions.message_count_day_d2c.value * questions.device_count.value;
      const ingress_data_s_MB = ingress_data_day_KB / 86400.0;
      const event_hub_throughput_unit = Math.ceil(ingress_data_s_MB);
      
      const event_hub_events = questions.message_count_day_d2c.value * 30.0;
      const messages_month_million = Math.ceil(event_hub_events / 1000000.0);

      // Calculate the "recommended" price
      // Basic will be cheaper if they don't need Kafka
      const expense_throughput = pricing[kafka_support ? 'DZH318Z0BQFF_Standard_Standard Throughput Unit' : 'DZH318Z0BQFF_Basic_Basic Throughput Unit'].unitPrice * event_hub_throughput_unit;
      const expense_messages = pricing[kafka_support ? 'DZH318Z0BQFF_Standard_Standard Ingress Events' : 'DZH318Z0BQFF_Basic_Basic Ingress Events'].unitPrice * messages_month_million;
      const expense = expense_throughput + expense_messages;

      const event_hub_cost = {
        basic: pricing['DZH318Z0BQFF_Basic_Basic Throughput Unit'].unitPrice * event_hub_throughput_unit + pricing['DZH318Z0BQFF_Basic_Basic Ingress Events'].unitPrice * messages_month_million,
        standard: pricing['DZH318Z0BQFF_Standard_Standard Throughput Unit'].unitPrice * event_hub_throughput_unit + pricing['DZH318Z0BQFF_Standard_Standard Ingress Events'].unitPrice * messages_month_million,
      };
      
      // To avoid an infinite update loop, use the same update time
      this.setState({
        lastSynced: initState,
        currentPricingRegion: armRegionName,
      }, async () => {
        // Verify that the inputs result in new outputs
        if (!_.isEqual(outputs.event_hub_cost, event_hub_cost) || !_.isEqual(armRegionName, currentPricingRegion) || !_.isEqual(lastSynced, lastUpdated)) {
          await updateOutputs(
            initState,
            {
              event_hub_cost,
              kafka_support,
              event_hub_events,
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
        order: 30,
        name: "Event Hub",
        serviceFamily: "Internet of Things",
        url_pricing: "https://azure.microsoft.com/en-us/pricing/details/event-hubs/",
        logos: {
          Devices: [],
          Connectivity: [],
          Messaging: [],
          Provisioning: [],
          RealTime: [],
          Management: [],
          Scaling: [],
          CrossRegion: [],
          Hot: ['Azure_Event_Hub.png'],
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
      event_hub_kafka_support: {
        parent: SERVICE_ID,
        serviceQuestionOrder: 0,
        prompt: "Do you need Apache Kafka support?",
        promptType: "options",
        outputType: "bool",
        value: false,
        options: [{
          value: false,
          prompt: "No",
        },{
          value: true,
          prompt: "Yes",
        }],
      },
    });

    // Initialize the centrally updated variables to allow other services to build on your service
    await registerOutputs({
      event_hub_cost: {
        basic: 0,
        standard: 0,
      },
      kafka_support: false,
      event_hub_events: 0,
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
            Event Hub
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
                  {(outputs.kafka_support) ? (
                    <td />
                  ) : (
                    <td>
                      {outputs.event_hub_cost['basic'].toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                    </td>
                  )}
                  <td>
                    {outputs.event_hub_cost['standard'].toLocaleString('en-US', {style: 'currency', currency: 'USD'})}
                  </td>
              </tr>
            </tbody>
          </table>
          <ToggleService
            service={SERVICE_ID} />
        </div>
    );
  }
}

EventHub.contextType = ServiceContext;

export async function getStaticProps(context) {
  return {
    props: {
    },
  };
};

export default EventHub;
