import { IContextualValidator, IStage } from '@spinnaker/core';

import { resourceSelectionStageValidator } from 'kubernetes/v2/manifest/selector/validators';

export const patchManifestValidator: IContextualValidator = (stage: IStage) => {
  const validation = resourceSelectionStageValidator(stage);
  return validation.validateForm();
};
