import React, { Component } from 'react';
import {TouchableOpacity, Modal} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import PropTypes from 'prop-types';
import Loading from '../common/Loading';
import CustomStepContainer from './CustomStepContainer';

class CustomStep extends Component {
  /* istanbul ignore next */
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      uri: '',
    };

    this.renderComponent = this.renderComponent.bind(this);
  }

  componentDidMount() {
    const { delay } = this.props;
    const { waitAction, delay : customDelay } = this.props.step;
    setTimeout(() => {
      this.setState({ loading: false });
      if (!waitAction) {
        setTimeout(() => {
          this.props.triggerNextStep();
        }, customDelay ? customDelay : 0);
      }
    }, delay);
  }

  renderComponent() {
    const { step, steps, previousStep, triggerNextStep } = this.props;
    const { component, metadata } = step;
    if(metadata && metadata.uri) {
      return React.cloneElement(
      <TouchableOpacity
        onPress={() => {
          this.setState({uri: metadata.uri})
        }}>
        {component}
      </TouchableOpacity>, {
        step,
        steps,
        previousStep,
        triggerNextStep,
      });
    }
    return React.cloneElement(component, {
      step,
      steps,
      previousStep,
      triggerNextStep,
    });
  }

  render() {
    const { loading } = this.state;
    const { style, step } = this.props;

    return (
      <CustomStepContainer
        className="rsc-cs"
        style={style}
      >
        {
          loading ? (
            <Loading
              color={step.loadingColor}
              custom={true}
            />
          ) : this.renderComponent()
        }
        <Modal visible={this.state.uri !== ''} transparent={true}>
          <ImageViewer
            imageUrls={[
              {
                url: this.state.uri,
              },
            ]}
            onSwipeDown={() => {
              this.setState({uri: ''});
            }}
            enableSwipeDown={true}
          />
        </Modal>
      </CustomStepContainer>
    );
  }
}

CustomStep.propTypes = {
  delay: PropTypes.number.isRequired,
  step: PropTypes.object.isRequired,
  steps: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  previousStep: PropTypes.object.isRequired,
  triggerNextStep: PropTypes.func.isRequired,
};

export default CustomStep;
