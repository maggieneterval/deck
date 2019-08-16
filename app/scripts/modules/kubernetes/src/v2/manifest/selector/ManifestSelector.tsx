import * as React from 'react';
import Select, { Creatable, Option } from 'react-select';
import { get, isEmpty } from 'lodash';
import * as DOMPurify from 'dompurify';
import { FormikProps } from 'formik';

import {
  AccountService,
  Application,
  FormField,
  FormikFormField,
  IStage,
  ReactSelectInput,
  StageConstants,
  useLatestPromise,
} from '@spinnaker/core';

import { IManifestSelector, SelectorMode } from 'kubernetes/v2/manifest/selector/IManifestSelector';
import LabelEditor from 'kubernetes/v2/manifest/selector/labelEditor/LabelEditor';
import { IManifestLabelSelector } from 'kubernetes/v2/manifest/selector/IManifestLabelSelector';
import { ResourceSelectionMethod } from 'kubernetes/v2/manifest/selector/ResourceSelectionMethod';
import { ClusterSelector } from 'kubernetes/v2/manifest/selector/ClusterSelector';
import { ResourceNameSelector } from 'kubernetes/v2/manifest/selector/ResourceNameSelector';
import { parseSpinnakerName } from 'kubernetes/v2/manifest/selector/resourceSelectorUtilities';

export type IResourceStage = IStage & IManifestSelector;

export interface IManifestSelectorProps {
  application?: Application;
  includeSpinnakerKinds?: string[];
  modes: SelectorMode[];
  formik: FormikProps<IStage>;
}

const promptTextCreator = (text: string) => `Use custom expression: ${text}`;
const isExpression = (value: string): boolean => (typeof value === 'string' ? value.includes('${') : false);

export function ManifestSelector({ application, includeSpinnakerKinds = [], modes, formik }: IManifestSelectorProps) {
  const selector = formik.values;
  const selectedMode = selector.mode || modes[0];

  // Fetch all accounts, and memoize details for selected account
  const fetchAccounts = useLatestPromise(() => AccountService.getAllAccountDetailsForProvider('kubernetes', 'v2'), []);
  const accountsLoaded = fetchAccounts.status === 'RESOLVED';
  const accounts = fetchAccounts.result || [];
  const selectedAccountDetails = React.useMemo(() => accounts.find(a => a.name === selector.account), [
    accounts,
    selector.account,
  ]);

  // Memoize namespace options available for selected account
  const namespaces = React.useMemo(() => get(selectedAccountDetails, 'namespaces', [].sort()), [
    selectedAccountDetails,
  ]);

  // When namespace options change, ensure selected namespace is still available
  React.useEffect(() => {
    if (!accountsLoaded) {
      return;
    }
    if (!isExpression(formik.values.location) && !namespaces.includes(selector.location)) {
      formik.setFieldValue('location', null);
    }
  }, [namespaces]);

  // Memoize kind options available for selected account
  const kinds = React.useMemo(() => {
    if (!selectedAccountDetails) {
      return [];
    }
    return Object.entries(selectedAccountDetails.spinnakerKindMap || {})
      .filter(([, spinnakerKind]) =>
        !isEmpty(includeSpinnakerKinds) ? includeSpinnakerKinds.includes(spinnakerKind) : true,
      )
      .map(([kind]) => kind)
      .sort();
  }, [selectedAccountDetails]);

  // Derive kind from manifestName in Static mode only
  const selectedKind = React.useMemo(() => {
    if (selectedMode === SelectorMode.Static) {
      return parseSpinnakerName(selector.manifestName).kind;
    }
    return selector.kind;
  }, [selectedMode, selector.manifestName, selector.kind]);
  const setSelectedKind = React.useCallback(
    (kind: string) => {
      if (selector.mode === SelectorMode.Static) {
        const { name } = parseSpinnakerName(selector.manifestName);
        formik.setFieldValue('manifestName', kind ? (name ? `${kind} ${name}` : kind) : name);
      } else {
        formik.setFieldValue('kind', kind);
      }
    },
    [selector.mode],
  );

  return (
    <>
      <h4>Resource Selection</h4>
      <div className="horizontal-rule" />
      <ResourceSelectionMethod modes={modes} formik={formik} />
      <FormikFormField
        fastField={false}
        input={props => (
          <ReactSelectInput
            {...props}
            clearable={false}
            disabled={!accountsLoaded}
            isLoading={fetchAccounts.status === 'PENDING'}
            placeholder={null}
            stringOptions={accounts.map(a => a.name)}
          />
        )}
        label="Account"
        name="account"
      />
      <FormField
        input={props => (
          <Creatable
            {...props}
            clearable={false}
            options={namespaces.map(ns => ({ value: ns, label: ns }))}
            placeholder={null}
            promptTextCreator={promptTextCreator}
          />
        )}
        label="Namespace"
        onChange={(option: Option<string>) => formik.setFieldValue('location', option.value)}
        value={{ value: selector.location, label: selector.location }}
      />
      {selectedMode !== SelectorMode.Label && (
        <FormField
          input={props => (
            <ReactSelectInput
              {...props}
              clearable={false}
              options={kinds.map(k => ({ value: k, label: k }))}
              placeholder={null}
            />
          )}
          label="Kind"
          onChange={(e: React.ChangeEvent<any>) => setSelectedKind(e.target.value)}
          value={selectedKind}
        />
      )}
      {selectedMode === SelectorMode.Static && <ResourceNameSelector formik={formik} />}
      {selectedMode === SelectorMode.Dynamic && (
        <ClusterSelector
          applications={application ? [application] : []}
          formik={formik}
          includeSpinnakerKinds={includeSpinnakerKinds}
        />
      )}
      {selectedMode === SelectorMode.Dynamic && (
        <FormField
          input={props => (
            <Select
              {...props}
              clearable={false}
              options={StageConstants.MANIFEST_CRITERIA_OPTIONS}
              optionRenderer={option => (
                <div className="body-regular">
                  <strong>
                    <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(option.label) }} />
                  </strong>
                  <div>
                    <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(option.description) }} />
                  </div>
                </div>
              )}
              placeholder={null}
              valueKey="val"
              valueRenderer={o => <>{o.label}</>}
            />
          )}
          value={selector.criteria}
          label="Target"
          onChange={(option: Option) => formik.setFieldValue('criteria', option.val)}
        />
      )}
      {selectedMode === SelectorMode.Label && (
        <FormField
          input={props => (
            <ReactSelectInput
              {...props}
              clearable={false}
              multi={true}
              options={kinds.map(k => ({ value: k, label: k }))}
              placeholder={null}
            />
          )}
          label="Kinds"
          onChange={(e: React.ChangeEvent<any>) => formik.setFieldValue('kinds', e.target.value)}
          value={selector.kinds || []}
        />
      )}
      {selectedMode === SelectorMode.Label && (
        <FormField
          input={props => (
            <LabelEditor
              {...props}
              labelSelectors={get(selector, 'labelSelectors.selectors', [])}
              onLabelSelectorsChange={(selectors: IManifestLabelSelector[]) =>
                formik.setFieldValue('labelSelectors', { selectors })
              }
            />
          )}
          label="Labels"
        />
      )}
    </>
  );
}
