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
    this.registerService = this.registerService.bind(this);
    this.registerQuestions = this.registerQuestions.bind(this);
    this.updateQuestion = this.updateQuestion.bind(this);
    this.registerOutputs = this.registerOutputs.bind(this);
    this.updateOutputs = this.updateOutputs.bind(this);
    this.registerExpense = this.registerExpense.bind(this);
    this.updateExpense = this.updateExpense.bind(this);
    this.setPricing = this.setPricing.bind(this);

    this.state = {
      services: {
        lastUpdated: 0,
        registry: {},
        questions: {},
        orderedQuestions: [],
        outputs: {},
        expenses: {},
        pricing: {},
        registerService: this.registerService,
        registerQuestions: this.registerQuestions,
        updateQuestion: this.updateQuestion,
        registerOutputs: this.registerOutputs,
        updateOutputs: this.updateOutputs,
        registerExpense: this.registerExpense,
        updateExpense: this.updateExpense,
        setPricing: this.setPricing,
      }
    };
  }

  async registerService(serviceId, service) {
    const {
      services,
    } = this.state;

    this.setState({
      services: update(services, {
        registry: {
          [serviceId]: {
            $set: service,
          },
        }
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
      const parentOrder = _.findIndex(services.registry, {parent: question.parent});
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
          $set: performance.now(),
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

  async updateOutputs(outputs) {
    const {
      services,
    } = this.state;

    this.setState({
      services: update(services, {
        outputs: {
          $merge: outputs,
        },
        lastUpdated: {
          $set: performance.now(),
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

  async updateExpense(serviceId, expense) {
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
          $set: performance.now(),
        },
      }),
    });
  }

  async setPricing(pricing) {
    const {
      services,
    } = this.state;

    this.setState({
      services: update(services, {
        pricing: {
          $set: pricing,
        },
        lastUpdated: {
          $set: performance.now(),
        },
      }),
    });
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
