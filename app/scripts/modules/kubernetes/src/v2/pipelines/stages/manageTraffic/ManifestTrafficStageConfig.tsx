import * as React from 'react';
import { defaults } from 'lodash';

import { FormikStageConfig, IStage, IStageConfigProps } from '@spinnaker/core';
import { ManifestSelector } from 'kubernetes/v2/manifest/selector/ManifestSelector';
import { IManifestSelector, SelectorMode } from 'kubernetes/v2/manifest/selector/IManifestSelector';

export interface IKubernetesManifestStageConfigProps extends IStageConfigProps {
  stage: IManifestSelector & IStage;
}

export function ManifestTrafficStageConfig(props: IKubernetesManifestStageConfigProps) {
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
        </div>
      )}
    />
  );
}
