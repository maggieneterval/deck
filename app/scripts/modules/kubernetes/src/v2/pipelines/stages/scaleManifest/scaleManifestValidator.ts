import { IContextualValidator, IStage } from '@spinnaker/core';

import { resourceSelectionStageValidator } from 'kubernetes/v2/manifest/selector/validators';

export const scaleManifestValidator: IContextualValidator = (stage: IStage) => {
  const validation = resourceSelectionStageValidator(stage);
  validation.field('replicas', 'Replicas').required();
  return validation.validateForm();
};
