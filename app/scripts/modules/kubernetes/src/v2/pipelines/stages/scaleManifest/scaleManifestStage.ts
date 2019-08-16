import { Registry, IStage, ExecutionDetailsTasks } from '@spinnaker/core';

import { manifestExecutionDetails } from 'kubernetes/v2/pipelines/stages/ManifestExecutionDetails';
import { ScaleManifestStageConfig } from 'kubernetes/v2/pipelines/stages/scaleManifest/ScaleManifestStageConfig';
import { scaleManifestValidator } from 'kubernetes/v2/pipelines/stages/scaleManifest/scaleManifestValidator';

const STAGE_KEY = 'scaleManifest';

Registry.pipeline.registerStage({
  label: 'Scale (Manifest)',
  description: 'Scale a Kubernetes object created from a manifest.',
  key: STAGE_KEY,
  cloudProvider: 'kubernetes',
  component: ScaleManifestStageConfig,
  executionDetailsSections: [manifestExecutionDetails(STAGE_KEY), ExecutionDetailsTasks],
  accountExtractor: (stage: IStage): string[] => (stage.account ? [stage.account] : []),
  configAccountExtractor: (stage: any): string[] => (stage.account ? [stage.account] : []),
  validateFn: scaleManifestValidator,
});
