import * as React from 'react';
import { FormikProps } from 'formik';

import { getFilteredClusterNames } from 'kubernetes/v2/manifest/selector/resourceSelectorUtilities';

import { Application, FormikFormField, IStage, ReactSelectInput } from '@spinnaker/core';

interface IClusterSelectorProps {
  applications: Application[];
  formik: FormikProps<IStage>;
  includeSpinnakerKinds: string[];
}

export function ClusterSelector({ applications, formik, includeSpinnakerKinds }: IClusterSelectorProps) {
  const { account, kind, location } = formik.values;
  const clusters = React.useMemo(() => {
    return getFilteredClusterNames(applications, account, kind, location, includeSpinnakerKinds);
  }, [applications, account, kind, location, includeSpinnakerKinds]);
  return (
    <FormikFormField
      fastField={false}
      input={props => <ReactSelectInput {...props} clearable={false} placeholder={null} stringOptions={clusters} />}
      label="Cluster"
      name="cluster"
    />
  );
}
