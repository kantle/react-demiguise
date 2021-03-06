import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const Container = styled.div`
  display: flex;
  flexDirection: column;
  justifyContent: center;
  alignItems: center;

  width: 100%;
  height: 100%;

  transition: opacity 1.5s ease-in;
  opacity: ${props => props.hidden ? 0 : 1};
`;


class Demiguise extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMessage: null,
      isMessageHidden: true,
    };

    // binding Methods
    this.setNextMessage = this.setNextMessage.bind(this);
    this.transitionEndHandler = this.transitionEndHandler.bind(this);
  }

  /* React Lifecycle */
  componentDidMount() {
    const { messages } = this.props;

    if (messages.length > 0) {
      this.messageIndex = -1;
      this.setNextMessage();
    }
  }

  /* Internal Methods */
  setNextMessage() {
    const { currentMessage } = this.state;
    const { messages, delay, loop, onLoopEnd } = this.props;

    this.messageIndex = this.messageIndex + 1;

    if (this.messageIndex === messages.length) {
      // the last message of the array is currently shown
      if (onLoopEnd) {
        onLoopEnd();
      }

      this.messageIndex = loop ? 0 : -1;
    }

    if (this.messageIndex >= 0) {
      if (!!currentMessage) {
        this.setState({
          nextMessage: messages[this.messageIndex],
          isMessageHidden: true,
        });
      } else {
        setTimeout(() => {
          this.setState({
            currentMessage: messages[this.messageIndex],
            isMessageHidden: false,
          });
        }, 200);
      }
    }
  }
  transitionEndHandler() {
    const { delay } = this.props;
    const { currentMessage, isMessageHidden, nextMessage } = this.state;

    // if message is now hidden
    if (isMessageHidden) {
      // we can swap text and show
      this.setState({
        currentMessage: nextMessage,
        nextMessage: null,
        isMessageHidden: false,
      });
    } else {
      // we can set next message
      let messageDelay = delay || 3000;
      if (Array.isArray(delay)) {
        messageDelay = delay.length > this.messageIndex
          ? delay[this.messageIndex]
          : delay[delay.length - 1];
      }
      setTimeout(this.setNextMessage, messageDelay);
    }
  }

  render() {
    const { currentMessage, isMessageHidden } = this.state;

    return (
      <Container
        hidden={ isMessageHidden }
        onTransitionEnd={ this.transitionEndHandler }
        style={ this.props.style }
      >
        { currentMessage }
      </Container>
    );
  }
}

/*Demiguise.propTypes = {
  delay: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  loop: PropTypes.bool,
  messages: PropTypes.arrayOf(PropTypes.string),
  onLoopEnd: PropTypes.func,
};*/
Demiguise.defaultProps = {
  delay: 3000,
  loop: false,
  messages: [],
};

export default Demiguise;
