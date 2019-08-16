import * as React from 'react';
import { Creatable, Option } from 'react-select';
import { FormikProps } from 'formik';

import { FormField, IStage, useData } from '@spinnaker/core';

import { ManifestKindSearchService } from 'kubernetes/v2/manifest/ManifestKindSearch';
import { parseSpinnakerName } from 'kubernetes/v2/manifest/selector/resourceSelectorUtilities';

interface IResourceNameSelector {
  formik: FormikProps<IStage>;
}

const promptTextCreator = (text: string) => `Use custom expression: ${text}`;

export function ResourceNameSelector({ formik }: IResourceNameSelector) {
  const selector = formik.values;
  const { kind } = parseSpinnakerName(selector.manifestName);
  const fetchResourceNames = useData(
    () => ManifestKindSearchService.search(kind, selector.location, selector.account),
    [],
    [selector.account, selector.location, kind],
  );
  const resourceNames: string[] = React.useMemo(
    () => (fetchResourceNames.result || []).map(r => parseSpinnakerName(r.name).name),
    [fetchResourceNames.result],
  );
  const handleNameChange = (selectedName: string): void => {
    formik.setFieldValue('manifestName', kind ? `${kind} ${selectedName}` : ` ${selectedName}`);
  };
  const name = parseSpinnakerName(selector.manifestName).name;
  return (
    <FormField
      input={props => (
        <Creatable
          {...props}
          clearable={false}
          disabled={fetchResourceNames.status !== 'RESOLVED'}
          isLoading={fetchResourceNames.status === 'PENDING'}
          options={resourceNames.map(r => ({ value: r, label: r }))}
          placeholder={null}
          promptTextCreator={promptTextCreator}
        />
      )}
      label="Name"
      onChange={(option: Option<string>) => handleNameChange(option ? (option.value as string) : '')}
      value={{ value: name, label: name }}
    />
  );
}
