import { IServerGroupManager } from '@spinnaker/core';

export interface IKubernetesServerGroupManager extends IServerGroupManager {
  kind: string;
  displayName: string;
  namespace: string;
}
