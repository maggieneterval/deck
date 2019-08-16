import {
  ArtifactReferenceService,
  ExecutionArtifactTab,
  ExecutionDetailsTasks,
  ExpectedArtifactService,
  Registry,
} from '@spinnaker/core';

import { DeployStatus } from 'kubernetes/v2/pipelines/stages/deployManifest/manifestStatus/DeployStatus';
import { PatchManifestStageConfig } from 'kubernetes/v2/pipelines/stages/patchManifest/PatchManifestStageConfig';
import { patchManifestValidator } from 'kubernetes/v2/pipelines/stages/patchManifest/patchManifestValidator';

export class PatchStatus extends DeployStatus {
  public static title = 'PatchStatus';
}

Registry.pipeline.registerStage({
  label: 'Patch (Manifest)',
  description: 'Patch a Kubernetes object in place.',
  key: 'patchManifest',
  cloudProvider: 'kubernetes',
  component: PatchManifestStageConfig,
  executionDetailsSections: [PatchStatus, ExecutionDetailsTasks, ExecutionArtifactTab],
  producesArtifacts: true,
  supportsCustomTimeout: true,
  validateFn: patchManifestValidator,
  artifactExtractor: ExpectedArtifactService.accumulateArtifacts(['manifestArtifactId', 'requiredArtifactIds']),
  artifactRemover: ArtifactReferenceService.removeArtifactFromFields(['manifestArtifactId', 'requiredArtifactIds']),
});
