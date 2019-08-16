import { Registry, ExecutionDetailsTasks, ExecutionArtifactTab } from '@spinnaker/core';

import { FindArtifactFromResourceStageConfig } from 'kubernetes/v2/pipelines/stages/findArtifactsFromResource/FindArtifactFromResourceStageConfig';
import { findArtifactsFromResourceValidator } from 'kubernetes/v2/pipelines/stages/findArtifactsFromResource/findArtifactsFromResourceValidator';

const STAGE_KEY = 'findArtifactsFromResource';

Registry.pipeline.registerStage({
  label: 'Find Artifacts From Resource (Manifest)',
  description: 'Finds artifacts from a Kubernetes resource.',
  key: STAGE_KEY,
  cloudProvider: 'kubernetes',
  component: FindArtifactFromResourceStageConfig,
  executionDetailsSections: [ExecutionDetailsTasks, ExecutionArtifactTab],
  producesArtifacts: true,
  validateFn: findArtifactsFromResourceValidator,
});
