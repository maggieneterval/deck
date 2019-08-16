import * as React from 'react';
import { defaults } from 'lodash';

import { FormikStageConfig, IStageConfigProps } from '@spinnaker/core';

import { ManifestSelector } from 'kubernetes/v2/manifest/selector/ManifestSelector';
import { SelectorMode } from 'kubernetes/v2/manifest/selector/IManifestSelector';

export function FindArtifactFromResourceStageConfig(props: IStageConfigProps) {
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
        <ManifestSelector
          application={application}
          formik={formik}
          modes={[SelectorMode.Static, SelectorMode.Dynamic]}
        />
      )}
    />
  );
}
