import * as React from 'react';
import { defaults } from 'lodash';

import { FormikFormField, FormikStageConfig, HelpField, IStageConfigProps, NumberInput } from '@spinnaker/core';

import { ManifestSelector } from 'kubernetes/v2/manifest/selector/ManifestSelector';
import { SelectorMode } from 'kubernetes/v2/manifest/selector/IManifestSelector';

export function UndoRolloutStageConfig(props: IStageConfigProps) {
  const stage = React.useMemo(() => {
    return defaults(props.stage, {
      app: props.application.name,
      cloudProvider: 'kubernetes',
      numRevisionsBack: 1,
    });
  }, []);

  return (
    <FormikStageConfig
      {...props}
      stage={stage}
      onChange={props.updateStage}
      render={({ application, formik }) => (
        <div className="form-horizontal">
          <ManifestSelector application={application} formik={formik} modes={[SelectorMode.Static]} />
          <h4>Settings</h4>
          <div className="horizontal-rule" />
          <FormikFormField
            help={<HelpField id="kubernetes.manifest.undoRollout.revisionsBack" />}
            label="Number of Revisions Back"
            name="numRevisionsBack"
            input={inputProps => <NumberInput {...inputProps} min={0} />}
          />
        </div>
      )}
    />
  );
}
