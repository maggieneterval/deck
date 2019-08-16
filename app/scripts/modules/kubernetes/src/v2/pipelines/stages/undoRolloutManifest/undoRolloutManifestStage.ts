import { Registry, IStage } from '@spinnaker/core';

import { UndoRolloutStageConfig } from 'kubernetes/v2/pipelines/stages/undoRolloutManifest/UndoRolloutStageConfig';
import { undoRolloutManifestValidator } from 'kubernetes/v2/pipelines/stages/undoRolloutManifest/undoRolloutManifestValidator';

Registry.pipeline.registerStage({
  label: 'Undo Rollout (Manifest)',
  description: 'Rollback a manifest a target number of revisions.',
  key: 'undoRolloutManifest',
  cloudProvider: 'kubernetes',
  component: UndoRolloutStageConfig,
  accountExtractor: (stage: IStage): string[] => (stage.account ? [stage.account] : []),
  configAccountExtractor: (stage: any): string[] => (stage.account ? [stage.account] : []),
  validateFn: undoRolloutManifestValidator,
});
