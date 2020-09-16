import React from 'react';
import { shallow } from 'enzyme';

import { noop } from '@spinnaker/core';

import { GCEProviderSettings } from 'google/gce.settings';
import { GcePredictiveAutoscaling } from './GcePredictiveAutoscaling';

describe('<GcePredictiveAutoscaling />', () => {
  afterEach(GCEProviderSettings.resetToOriginal);
  describe('Configuration', () => {
    it('Does not render if no feature config', () => {
      // todo(mneterval): should not throw error
      expect(() => shallow(<GcePredictiveAutoscaling policy={null} updatePolicy={noop} />)).toThrowError();
    });
    it('Renders if feature flag is enabled', () => {
      GCEProviderSettings.feature = { predictiveAutoscaling: true };
      const wrapper = shallow(<GcePredictiveAutoscaling policy={null} updatePolicy={noop} />);
      expect(wrapper.isEmptyRender()).toEqual(false);
    });
    it('Does not render if feature flag is disabled', () => {
      GCEProviderSettings.feature = { predictiveAutoscaling: false };
      const wrapper = shallow(<GcePredictiveAutoscaling policy={null} updatePolicy={noop} />);
      expect(wrapper.isEmptyRender()).toEqual(true);
    });
  });
});
