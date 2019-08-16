import { module } from 'angular';

import { CloudProviderRegistry, STAGE_ARTIFACT_SELECTOR_COMPONENT_REACT, YAML_EDITOR_COMPONENT } from '@spinnaker/core';

import { KUBERNETES_MANIFEST_DELETE_CTRL } from './manifest/delete/delete.controller';
import { KUBERNETES_MANIFEST_SCALE_CTRL } from './manifest/scale/scale.controller';
import { KUBERNETES_V2_INSTANCE_DETAILS_CTRL } from './instance/details/details.controller';
import { KUBERNETES_V2_LOAD_BALANCER_DETAILS_CTRL } from './loadBalancer/details/details.controller';
import { KUBERNETES_V2_SECURITY_GROUP_DETAILS_CTRL } from './securityGroup/details/details.controller';
import { KUBERNETES_V2_SERVER_GROUP_TRANSFORMER } from './serverGroup/serverGroupTransformer.service';
import { KUBERNETES_V2_SERVER_GROUP_DETAILS_CTRL } from './serverGroup/details/details.controller';
import { KUBERNETES_V2_SERVER_GROUP_RESIZE_CTRL } from './serverGroup/details/resize/resize.controller';
import { KUBERNETES_V2_SERVER_GROUP_COMMAND_BUILDER } from './serverGroup/serverGroupCommandBuilder.service';
import { KUBERNETES_V2_SERVER_GROUP_MANAGER_DETAILS_CTRL } from './serverGroupManager/details/details.controller';
import { KUBERNETES_MANIFEST_UNDO_ROLLOUT_CTRL } from './manifest/rollout/undo.controller';
import { KUBERNETES_MANIFEST_PAUSE_ROLLOUT_CTRL } from './manifest/rollout/pause.controller';
import { KUBERNETES_MANIFEST_RESUME_ROLLOUT_CTRL } from './manifest/rollout/resume.controller';
import { KUBERNETES_MANIFEST_STATUS } from './manifest/status/status.component';
import { KUBERNETES_MANIFEST_CONDITION } from './manifest/status/condition.component';
import { KUBERNETES_MANIFEST_ARTIFACT } from './manifest/artifact/artifact.component';
import { KUBERNETES_MANIFEST_LABELS } from './manifest/manifestLabels.component';
import { KUBERNETES_MANIFEST_EVENTS } from './manifest/manifestEvents.component';
import { KUBERNETES_MANIFEST_RESOURCES } from './manifest/manifestResources.component';
import { KUBERNETES_MANIFEST_QOS } from './manifest/manifestQos.component';
import { KUBERNETES_V2_LOAD_BALANCER_TRANSFORMER } from './loadBalancer/transformer';
import { KUBERNETES_V2_SECURITY_GROUP_TRANSFORMER } from './securityGroup/transformer';
import { KUBERNETES_ANNOTATION_CUSTOM_SECTIONS } from './manifest/annotationCustomSections.component';
import { KUBERNETES_V2_RESOURCE_STATES } from './resources/resources.state';
import { KUBERNETES_MANIFEST_IMAGE_DETAILS } from 'kubernetes/v2/manifest/manifestImageDetails.component';
import { JSON_EDITOR_COMPONENT } from './manifest/editor/json/jsonEditor.component';
import { ManifestWizard } from 'kubernetes/v2/manifest/wizard/ManifestWizard';
import { KubernetesSecurityGroupReader } from 'kubernetes/shared/securityGroup/securityGroup.reader';
import { KUBERNETES_ROLLING_RESTART } from 'kubernetes/v2/manifest/rollout/RollingRestart';

import 'kubernetes/shared/validation/applicationName.validator';
import 'kubernetes/shared/help/kubernetes.help';
import 'kubernetes/shared/logo/kubernetes.logo.less';
import 'kubernetes/v2/pipelines/stages';

// load all templates into the $templateCache
const templates = require.context('kubernetes', true, /\.html$/);
templates.keys().forEach(function(key) {
  templates(key);
});

export const KUBERNETES_V2_MODULE = 'spinnaker.kubernetes.v2';

module(KUBERNETES_V2_MODULE, [
  KUBERNETES_V2_INSTANCE_DETAILS_CTRL,
  KUBERNETES_V2_LOAD_BALANCER_DETAILS_CTRL,
  KUBERNETES_V2_SECURITY_GROUP_DETAILS_CTRL,
  KUBERNETES_V2_SERVER_GROUP_COMMAND_BUILDER,
  KUBERNETES_V2_SERVER_GROUP_DETAILS_CTRL,
  KUBERNETES_V2_SERVER_GROUP_TRANSFORMER,
  KUBERNETES_V2_SERVER_GROUP_MANAGER_DETAILS_CTRL,
  KUBERNETES_V2_SERVER_GROUP_RESIZE_CTRL,
  KUBERNETES_V2_SERVER_GROUP_MANAGER_DETAILS_CTRL,
  KUBERNETES_MANIFEST_DELETE_CTRL,
  KUBERNETES_MANIFEST_SCALE_CTRL,
  KUBERNETES_MANIFEST_UNDO_ROLLOUT_CTRL,
  KUBERNETES_MANIFEST_PAUSE_ROLLOUT_CTRL,
  KUBERNETES_MANIFEST_RESUME_ROLLOUT_CTRL,
  KUBERNETES_MANIFEST_STATUS,
  KUBERNETES_MANIFEST_CONDITION,
  KUBERNETES_MANIFEST_ARTIFACT,
  KUBERNETES_V2_LOAD_BALANCER_TRANSFORMER,
  KUBERNETES_V2_SECURITY_GROUP_TRANSFORMER,
  KUBERNETES_MANIFEST_LABELS,
  KUBERNETES_MANIFEST_EVENTS,
  KUBERNETES_MANIFEST_RESOURCES,
  KUBERNETES_MANIFEST_QOS,
  KUBERNETES_ANNOTATION_CUSTOM_SECTIONS,
  KUBERNETES_MANIFEST_IMAGE_DETAILS,
  KUBERNETES_V2_RESOURCE_STATES,
  YAML_EDITOR_COMPONENT,
  JSON_EDITOR_COMPONENT,
  STAGE_ARTIFACT_SELECTOR_COMPONENT_REACT,
  KUBERNETES_ROLLING_RESTART,
]).config(() => {
  CloudProviderRegistry.registerProvider('kubernetes', {
    name: 'Kubernetes',
    skin: 'v2',
    logo: {
      path: require('../shared/logo/kubernetes.icon.svg'),
    },
    serverGroup: {
      CloneServerGroupModal: ManifestWizard,
      commandBuilder: 'kubernetesV2ServerGroupCommandBuilder',
      detailsController: 'kubernetesV2ServerGroupDetailsCtrl',
      detailsTemplateUrl: require('./serverGroup/details/details.html'),
      transformer: 'kubernetesV2ServerGroupTransformer',
    },
    serverGroupManager: {
      detailsTemplateUrl: require('./serverGroupManager/details/details.html'),
      detailsController: 'kubernetesV2ServerGroupManagerDetailsCtrl',
    },
    loadBalancer: {
      CreateLoadBalancerModal: ManifestWizard,
      detailsController: 'kubernetesV2LoadBalancerDetailsCtrl',
      detailsTemplateUrl: require('./loadBalancer/details/details.html'),
      transformer: 'kubernetesV2LoadBalancerTransformer',
    },
    securityGroup: {
      reader: KubernetesSecurityGroupReader,
      CreateSecurityGroupModal: ManifestWizard,
      detailsController: 'kubernetesV2SecurityGroupDetailsCtrl',
      detailsTemplateUrl: require('./securityGroup/details/details.html'),
      transformer: 'kubernetesV2SecurityGroupTransformer',
    },
    instance: {
      detailsController: 'kubernetesV2InstanceDetailsCtrl',
      detailsTemplateUrl: require('./instance/details/details.html'),
    },
    unsupportedStageTypes: [
      'deploy',
      'destroyServerGroup',
      'disableCluster',
      'disableServerGroup',
      'enableServerGroup',
      'findImage',
      'resizeServerGroup',
      'rollbackCluster',
      'runJob',
      'scaleDown',
      'scaleDownCluster',
      'shrinkCluster',
    ],
  });
});
