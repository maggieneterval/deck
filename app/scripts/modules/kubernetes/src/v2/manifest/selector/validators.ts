import { FormValidator, IStage, Validators } from '@spinnaker/core';

import { SelectorMode } from 'kubernetes/v2/manifest/selector/IManifestSelector';

export const resourceSelectionStageValidator = (stage: IStage): FormValidator => {
  const formValidator = new FormValidator(stage);
  formValidator.field('account', 'Account').required();
  formValidator.field('location', 'Namespace').required();

  if (stage.mode === SelectorMode.Dynamic) {
    formValidator.field('kind', 'Kind').required();
    formValidator.field('cluster', 'Cluster').required();
    formValidator.field('criteria', 'Target').required();
  }

  if (stage.mode === SelectorMode.Static) {
    formValidator
      .field('manifestName')
      .required()
      .withValidators((value: string) => {
        const [kind, name] = (value || '').split(' ');
        if (!kind) {
          return 'Kind is required';
        }
        if (!name) {
          return 'Name is required';
        }
        return null;
      });
  }

  if (stage.mode === SelectorMode.Label) {
    formValidator.field('kinds', 'Kinds').withValidators(Validators.arrayNotEmpty());
  }

  return formValidator;
};
