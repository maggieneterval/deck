import { IContextualValidator, IStage } from '@spinnaker/core';

import { resourceSelectionStageValidator } from 'kubernetes/v2/manifest/selector/validators';

export const undoRolloutManifestValidator: IContextualValidator = (stage: IStage) => {
  const validation = resourceSelectionStageValidator(stage);
  validation.field('numRevisionsBack', 'Number of Revisions Back').required();
  return validation.validateForm();
};
