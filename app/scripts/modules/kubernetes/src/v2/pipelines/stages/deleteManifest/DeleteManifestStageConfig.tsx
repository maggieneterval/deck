import * as React from 'react';
import { defaults } from 'lodash';

import {
  CheckboxInput,
  FormikFormField,
  FormikStageConfig,
  HelpField,
  IStageConfigProps,
  NumberInput,
} from '@spinnaker/core';

import { IResourceStage, ManifestSelector } from 'kubernetes/v2/manifest/selector/ManifestSelector';
import { SelectorMode } from 'kubernetes/v2/manifest/selector/IManifestSelector';
import { IDeleteOptions } from 'kubernetes/v2/manifest/delete/delete.controller';

interface IDeleteResourceStage extends IResourceStage {
  options: IDeleteOptions;
}

export interface IKubernetesManifestStageConfigProps extends IStageConfigProps {
  stage: IDeleteResourceStage;
}

export function DeleteManifestStageConfig(props: IKubernetesManifestStageConfigProps) {
  const stage = React.useMemo(() => {
    return defaults(props.stage, {
      app: props.application.name,
      cloudProvider: 'kubernetes',
      options: {
        cascading: true,
        gracePeriodSeconds: '',
      },
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
            modes={[SelectorMode.Static, SelectorMode.Dynamic, SelectorMode.Label]}
          />
          <h4>Deletion Settings</h4>
          <div className="horizontal-rule" />
          <FormikFormField
            name="options.cascading"
            label="Cascading"
            help={<HelpField id="kubernetes.manifest.delete.cascading" />}
            input={inputProps => <CheckboxInput {...inputProps} />}
          />
          <FormikFormField
            name="options.gracePeriodSeconds"
            label="Grace Period"
            help={<HelpField id="kubernetes.manifest.delete.gracePeriod" />}
            input={inputProps => <NumberInput {...inputProps} min={0} validation={null} />}
          />
        </div>
      )}
    />
  );
}
