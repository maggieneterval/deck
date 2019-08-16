import { ExecutionDetailsTasks, IStage, Registry } from '@spinnaker/core';

import { manifestExecutionDetails } from 'kubernetes/v2/pipelines/stages/ManifestExecutionDetails';
import { ManifestTrafficStageConfig } from 'kubernetes/v2/pipelines/stages/manageTraffic/ManifestTrafficStageConfig';
import { manageTrafficValidator } from 'kubernetes/v2/pipelines/stages/manageTraffic/manageTrafficValidator';

const STAGE_NAME = 'Enable (Manifest)';
const STAGE_KEY = 'enableManifest';

Registry.pipeline.registerStage({
  label: STAGE_NAME,
  description: 'Enable a Kubernetes manifest.',
  key: STAGE_KEY,
  cloudProvider: 'kubernetes',
  component: ManifestTrafficStageConfig,
  executionDetailsSections: [manifestExecutionDetails(STAGE_KEY), ExecutionDetailsTasks],
  supportsCustomTimeout: true,
  accountExtractor: (stage: IStage): string[] => (stage.account ? [stage.account] : []),
  configAccountExtractor: (stage: IStage): string[] => (stage.account ? [stage.account] : []),
  validateFn: manageTrafficValidator,
});
