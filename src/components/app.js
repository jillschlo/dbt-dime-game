import '../styles/app.css';
import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import DocumentMeta from 'react-document-meta';
import { PromptCount } from '../classes/prompts';
import DecisionTypeChooser from './decision-type-chooser';
import Prompt from './prompt';
import Result from './result';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dimes: 0,
            answers: new Array(PromptCount).fill(null),
            stage: 'pickDecisionType',
            decisionType: null,
        }

        this.handleDecisionTypeChoice = this.handleDecisionTypeChoice.bind(this);
        this.handlePromptsDone = this.handlePromptsDone.bind(this);
        this.handlePromptAnswered = this.handlePromptAnswered.bind(this);
        this.handleRestart = this.handleRestart.bind(this);
        this.handleToggleAnswer = this.handleToggleAnswer.bind(this);
    }

    handleDecisionTypeChoice(choice) {
        this.setState({
            decisionType: choice,
            stage: 'prompts',
        });
    }

    handlePromptsDone() {
        this.setState({
            stage: 'showResults',
        });
    }

    handlePromptAnswered(index, answer, addDime) {
        let answers = this.state.answers.slice();
        answers[index] = answer;

        this.setState({
            answers: answers,
            dimes: this.state.dimes + (addDime ? 1 : 0),
        });
    }

    handleRestart() {
        this.setState({
            dimes: 0,
            answers: new Array(PromptCount).fill(null),
            stage: 'pickDecisionType',
            decisionType: null,
        });
    }

    handleToggleAnswer(index) {
        let answers = this.state.answers.slice(),
            answer = answers[index],
            dimes = this.state.dimes;

        if (answer === 'yes') {
            answers[index] = 'no';
            dimes += this.state.decisionType === 'ask' ? -1 : 1;
        } else {
            answers[index] ='yes';
            dimes += this.state.decisionType === 'ask' ? 1 : -1;
        }

        this.setState({
            answers: answers,
            dimes: dimes,
        });
    }

    render() {
  let q = null;

  const jumboTitle =
    this.state.decisionType === null
      ? "Do I ask?  Do I say no?"
      : this.state.decisionType === "ask"
      ? "Do I ask?  How assertively?"
      : "Do I say no?  How assertively?";

  let jumboDesc = null;

  // In BS5, visibility utilities use d-*-*
  // Original logic: hide hero on XS unless we're picking decision type
  let jumboVisibility =
    this.state.stage === "pickDecisionType" ? "" : "d-none d-sm-block";

  switch (this.state.stage) {
    case "pickDecisionType":
      q = <DecisionTypeChooser onChoose={this.handleDecisionTypeChoice} />;
      jumboDesc = (
        <p>
          If you have difficulty deciding how assertively to make a request or
          to decline someone else's request, try using the <i>Dime Game</i> from
          the DBT Interpersonal Effectiveness module. We'll ask a series of
          yes-or-no questions. At the end, we'll tally the results and give you
          guidance on how strongly to ask or decline.
        </p>
      );
      break;

    case "prompts":
      q = (
        <Prompt
          key="prompts"
          onPromptAnswered={this.handlePromptAnswered}
          onDone={this.handlePromptsDone}
          dimes={this.state.dimes}
          decisionType={this.state.decisionType}
        />
      );
      break;

    case "showResults":
      q = (
        <Result
          dimes={this.state.dimes}
          decisionType={this.state.decisionType}
          answers={this.state.answers}
          onRestart={this.handleRestart}
          onToggleAnswer={this.handleToggleAnswer}
        />
      );
      break;

    default:
      break;
  }

  const links = [
    <li key="link1" className="list-inline-item">
      <a
        className="link-secondary"
        href="https://www.amazon.com/Skills-Training-Handouts-Worksheets-Second/dp/1572307811/"
      >
        DBT® Skills Training Handouts and Worksheets, Second Edition
      </a>
    </li>,
  ];

  // Move meta definition above return so it's reachable
  var meta = {
    title: "DBT Dime Game",
    description:
      'Use the DBT "Dime Game" to determine how forcefully to ask or say no to a request',
    canonical: "https://www.dimegame.online/",
    meta: {
      name: {
        viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0",
        keywords: "dbt,dime game,interpersonal effectiveness",
        author: "Jordan Hitch",
      },
      property: {
        "og:title": "DBT Dime Game",
        "og:description":
          'Use the DBT "Dime Game" to determine how forcefully to ask or say no to a request',
        "og:type": "website",
      },
    },
  };

  return (
    <div className="App">
      <DocumentMeta {...meta} />

      {/* BS5 replacement for Jumbotron */}
      <div className={`p-5 mb-4 bg-light rounded-3 ${jumboVisibility}`}>
        <Container>
          <h1 className="display-6">{jumboTitle}</h1>
          {jumboDesc}
        </Container>
      </div>

      {/* Main content container */}
      <Container className="app-container">{q}</Container>

      {/* Fixed bottom bar; hidden on XS like your original */}
      <Navbar
        fixed="bottom"
        className="d-none d-sm-block bg-body-tertiary border-top"
      >
        <Container className="d-flex justify-content-between align-items-center py-2">
          {/* Left links */}
          <ul className="list-inline mb-0">{links}</ul>

          {/* Right links */}
          <ul className="list-inline mb-0">
            <li className="list-inline-item">
              <a
                className="link-secondary"
                href="https://github.com/dfoverdx/dbt-dime-game"
              >
                Source Code
              </a>
            </li>
            <li className="list-inline-item">
              <a className="link-secondary" href="/">
                Bethany Hitch
              © 2023
                </a>
            </li>
            <li className="list-inline-item">
            <a
                className="link-secondary"
                href="https://github.com/jillschlo/dbt-dime-game"
              >
                Maintained by Jillian Schlotfeldt
              </a>
              </li>
          </ul>
        </Container>
      </Navbar>
    </div>
  );
};
};

export default App;
