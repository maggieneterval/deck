import * as React from 'react';
import { defaults } from 'lodash';

import { FormikFormField, FormikStageConfig, IStageConfigProps, NumberInput } from '@spinnaker/core';

import { ManifestSelector } from 'kubernetes/v2/manifest/selector/ManifestSelector';
import { SelectorMode } from 'kubernetes/v2/manifest/selector/IManifestSelector';

export function ScaleManifestStageConfig(props: IStageConfigProps) {
  const stage = React.useMemo(() => {
    return defaults(props.stage, {
      app: props.application.name,
      cloudProvider: 'kubernetes',
    });
  }, []);

  return (
    <FormikStageConfig
      {...props}
      stage={stage}
      onChange={props.updateStage}
      render={({ application, formik }) => (
        <div className="form-horizontal">
          <ManifestSelector
            application={application}
            formik={formik}
            modes={[SelectorMode.Static, SelectorMode.Dynamic]}
            includeSpinnakerKinds={['serverGroups']}
          />
          <h4>Settings</h4>
          <div className="horizontal-rule" />
          <FormikFormField
            label="Replicas"
            name="replicas"
            input={inputProps => <NumberInput {...inputProps} min={0} validation={null} />}
          />
        </div>
      )}
    />
  );
}
