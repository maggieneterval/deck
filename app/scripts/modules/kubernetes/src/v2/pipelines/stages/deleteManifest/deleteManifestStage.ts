import { Registry, IStage, ExecutionDetailsTasks } from '@spinnaker/core';

import { manifestExecutionDetails } from 'kubernetes/v2/pipelines/stages/ManifestExecutionDetails';
import { DeleteManifestStageConfig } from 'kubernetes/v2/pipelines/stages/deleteManifest/DeleteManifestStageConfig';
import { deleteManifestValidator } from 'kubernetes/v2/pipelines/stages/deleteManifest/deleteManifestValidator';

const STAGE_KEY = 'deleteManifest';

Registry.pipeline.registerStage({
  label: 'Delete (Manifest)',
  description: 'Destroy a Kubernetes object created from a manifest.',
  key: STAGE_KEY,
  cloudProvider: 'kubernetes',
  component: DeleteManifestStageConfig,
  executionDetailsSections: [manifestExecutionDetails(STAGE_KEY), ExecutionDetailsTasks],
  accountExtractor: (stage: IStage): string[] => (stage.account ? [stage.account] : []),
  configAccountExtractor: (stage: any): string[] => (stage.account ? [stage.account] : []),
  validateFn: deleteManifestValidator,
});
