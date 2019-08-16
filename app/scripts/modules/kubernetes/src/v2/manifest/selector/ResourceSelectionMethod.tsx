import * as React from 'react';
import { FormikProps } from 'formik';

import { FormField, HelpField, IRadioButtonOptions, IStage, RadioButtonInput } from '@spinnaker/core';

import { IManifestSelector, SelectorMode } from 'kubernetes/v2/manifest/selector/IManifestSelector';

const SelectorModeOptions: IRadioButtonOptions[] = [
  {
    help: <HelpField content="Select a target by name (e.g., the Deployment with name 'my-deployment-v000')." />,
    label: 'Choose a static target',
    value: SelectorMode.Static,
  },
  {
    help: <HelpField content="Select a target dynamically (e.g., the second newest ReplicaSet in cluster)." />,
    label: 'Choose a dynamic target',
    value: SelectorMode.Dynamic,
  },
  {
    help: (
      <HelpField content="Select one or more targets by label (e.g., all the ConfigMaps with label 'myKey=myValue')." />
    ),
    label: 'Match target(s) by label',
    value: SelectorMode.Label,
  },
];

const SelectorDefaults: Partial<IManifestSelector> = {
  cluster: null,
  criteria: null,
  kind: null,
  kinds: [],
  labelSelectors: {
    selectors: [],
  },
  manifestName: null,
};

interface IResourceSelectionMethodProps {
  formik: FormikProps<IStage>;
  modes: SelectorMode[];
}

export function ResourceSelectionMethod({ formik, modes }: IResourceSelectionMethodProps) {
  const selector = formik.values;
  const options = React.useMemo(
    () =>
      modes.map(mode => {
        return SelectorModeOptions.find(o => o.value === mode);
      }),
    [modes],
  );

  // If no mode selected, default to first available mode
  React.useEffect(() => {
    if (!selector.mode) {
      setMode(modes[0]);
    }
  }, []);

  // On mode change, reset all fields except Account and Namespace
  const setMode = React.useCallback((mode: string) => {
    formik.setFieldValue('mode', mode);
    Object.entries(SelectorDefaults).forEach(([key, val]) => {
      formik.setFieldValue(key, val);
    });
  }, []);

  if (options.length < 2) {
    return null;
  }

  return (
    <FormField
      input={inputProps => <RadioButtonInput {...inputProps} options={options} />}
      label="Selection Method"
      onChange={(e: React.ChangeEvent<any>) => setMode(e.target.value)}
      value={selector.mode}
    />
  );
}
