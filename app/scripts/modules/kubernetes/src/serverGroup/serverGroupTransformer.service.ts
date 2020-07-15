import { IPromise, IQService } from 'angular';
import { IKubernetesServerGroup } from './details/IKubernetesServerGroup';

export class KubernetesServerGroupTransformer {
  public static $inject = ['$q'];
  constructor(private $q: IQService) {}

  public normalizeServerGroup(serverGroup: IKubernetesServerGroup): IPromise<IKubernetesServerGroup> {
    // TODO(dpeach): this isn't great, but we need to assume it's a deployment so that we can click
    // into the details panel.
    (serverGroup.serverGroupManagers || []).forEach(manager => (manager.name = `deployment ${manager.name}`));
    return this.$q.when(serverGroup);
  }
}
