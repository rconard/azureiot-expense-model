import App, { Container } from 'next/app'
import _ from 'lodash';
import update from 'immutability-helper';
import Header from '../components/Header';
import { ServiceContext } from '../contexts/ServiceContext.js'
import '../styles/reset.css';
import '../styles/main.css';

export default class ExpenseWebApp extends App {
  constructor(props) {
    super(props);
    this.hashState = this.hashState.bind(this);
    this.registerService = this.registerService.bind(this);
    this.registerServiceAck = this.registerServiceAck.bind(this);
    this.registerQuestions = this.registerQuestions.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    this.registerOutputs = this.registerOutputs.bind(this);
    this.updateOutputs = this.updateOutputs.bind(this);
    this.registerExpense = this.registerExpense.bind(this);
    this.updateExpense = this.updateExpense.bind(this);
    this.pullPricing = this.pullPricing.bind(this);
    this.updateRegion = this.updateRegion.bind(this);

    this.state = {
      services: {
        lastUpdated: 'not_initialized',
        dev: false,
        armRegionName: 'westus',
        registry: {},
        orderedServices: [],
        questions: {},
        orderedQuestions: [],
        outputs: {},
        expenses: {},
        pricing: {},
        hashState: this.hashState,
        registerService: this.registerService,
        registerServiceAck: this.registerServiceAck,
        registerQuestions: this.registerQuestions,
        updateQuestion: this.updateQuestion,
        registerOutputs: this.registerOutputs,
        updateOutputs: this.updateOutputs,
        registerExpense: this.registerExpense,
        updateExpense: this.updateExpense,
        pullPricing: this.pullPricing,
        updateRegion: this.updateRegion,
      }
    };
  }

  hashState(armRegionName, questions, outputs, expenses) {
    // https://stackoverflow.com/a/8831937
    const hashCode = function(stringifyState) {
      var hash = 0;
      if (stringifyState.length == 0) {
        return hash;
      }
      for (var i = 0; i < stringifyState.length; i++) {
        var char = stringifyState.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    }

    return hashCode(JSON.stringify({
      armRegionName,
      questions,
      outputs,
      expenses,
    }));
  }

  async registerService(serviceId, service) {
    const {
      services,
    } = this.state;

    const registry = Object.assign(
      services.registry,
      {
        [serviceId]: service,
      }
    );

    const orderedServices = _.sortBy(Object.keys(registry), (service) => {
      return registry[service].order;
    });

    this.setState({
      services: update(services, {
        registry: {
          $set: registry,
        },
        orderedServices: {
          $set: orderedServices,
        },
      }),
    });
  }

  async registerServiceAck() {
    const {
      services,
    } = this.state;

    this.setState({
      services: update(services, {
        lastUpdated: {
          $set: this.hashState(this.state.armRegionName, this.state.questions, this.state.outputs, this.state.expenses),
        },
      }),
    });
  }

  async registerQuestions(newQuestions) {
    const {
      services,
    } = this.state;

    // Merge existing questions with registered questions
    const questions = Object.assign(
      services.questions,
      newQuestions
    );

    const orderedQuestions = _.sortBy(Object.keys(questions), [(questionField) => {
      const question = questions[questionField];
      const parentOrder = services.registry[question.parent].order;
      return parentOrder + (question.serviceQuestionOrder / 10000.0);
    }]);

    this.setState({
      services: update(services, {
        questions: {
          $set: questions,
        },
        orderedQuestions: {
          $set: orderedQuestions,
        }
      }),
    });
  }

  async updateQuestion(questionField, outputType, event) {
    const {
      services,
    } = this.state;
    
    const target = event.target;
    let value = null;
    if (target.type === 'checkbox') {
      value = target.checked;
    } else if (target.type === 'number') {
      if (outputType === 'integer') {
        value = Math.round(parseFloat(target.value));
      } else if (outputType === 'float') {
        value = parseFloat(target.value);
      }
    } else if (target.type === 'select-one') {
      if (['integer', 'float'].indexOf(outputType) > -1) {
        if (outputType === 'integer') {
          value = Math.round(parseFloat(target.value));
        } else if (outputType === 'float') {
          value = parseFloat(target.value);
        }
      } else {
        value = target.value;
      }
    }

    this.setState({
      services: update(services, {
        questions: {
          [questionField]: {
            value: {
              $set: value,
            },
          },
        },
        lastUpdated: {
          $set: this.hashState(this.state.armRegionName, this.state.questions, this.state.outputs, this.state.expenses),
        },
      }),
    });
  }

  async registerOutputs(outputs) {
    const {
      services,
    } = this.state;

    this.setState({
      services: update(services, {
        outputs: {
          $merge: outputs,
        },
      }),
    });
  }

  async updateOutputs(hashedState, updatedOutputs) {
    const {
      services,
    } = this.state;

    // Merge existing questions with registered questions
    const outputs = Object.assign(
      services.outputs,
      updatedOutputs
    );

    console.log([
      hashedState,
      services.lastUpdated
    ]);
    this.setState({
      services: update(services, {
        outputs: {
          $set: outputs,
        },
        lastUpdated: {
          $set: hashedState,
        },
      }),
    });
  }

  async registerExpense(serviceId, expenseValueInit) {
    const {
      services,
    } = this.state;

    this.setState({
      services: update(services, {
        expenses: {
          [serviceId]: {
            $set: expenseValueInit,
          },
        },
      }),
    });
  }

  async updateExpense(hashedState, serviceId, expense) {
    const {
      services,
    } = this.state;

    this.setState({
      services: update(services, {
        expenses: {
          [serviceId]: {
            $set: expense,
          },
        },
        lastUpdated: {
          $set: hashedState,
        },
      }),
    });
  }

  async pullPricing(armRegionName, serviceFamily) {
    const {
      services,
    } = this.state;

    const dev = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');
    const query = `/api/collateprices?$filter=armRegionName eq '${armRegionName}' and serviceFamily eq '${serviceFamily}'`;
    
    const requestPricing = await fetch(dev ? `http://localhost:7071${query}` : query);
    const responsePricing = await requestPricing.json();
    const pricingService = _.keyBy(responsePricing.pricing, i => i.productId + '_' + i.skuName);

    const pricing = Object.assign(
      services.pricing,
      pricingService
    );

    this.setState({
      services: update(services, {
        pricing: {
          $set: pricing,
        },
        armRegionName: {
          $set: armRegionName,
        },
        lastUpdated: {
          $set: this.hashState(this.state.armRegionName, this.state.questions, this.state.outputs, this.state.expenses),
        },
      }),
    });
  }

  async updateRegion(armRegionName) {
    const {
      services,
    } = this.state;

    const serviceFamilies = _.uniq(Object.keys(services.registry).map((serviceId) => {
      return services.registry[serviceId].serviceFamily;
    }));

    Promise.all(serviceFamilies.map((serviceFamily) => {
      return this.pullPricing(armRegionName, serviceFamily);
    }));
  }

  render () {
    const { Component, pageProps } = this.props

    return (
      <ServiceContext.Provider
        value={this.state.services} >
        <Header />
        <main>
          <Component
            {...pageProps}
            {...this.state} />
        </main>
      </ServiceContext.Provider>
    )
  }
}
