import { IServerGroupManager } from '@spinnaker/core';

export interface IKubernetesServerGroupManager extends IServerGroupManager {
  kind: string;
  namespace: string;
}
