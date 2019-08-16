import { get, isEmpty } from 'lodash';

import { AppListExtractor, Application, IServerGroup } from '@spinnaker/core';

export function parseSpinnakerName(spinnakerName: string): { name: string; kind: string } {
  if (isEmpty(spinnakerName)) {
    return { kind: null, name: null };
  }
  const [kind, name] = spinnakerName.split(' ');
  return { kind, name };
}

export function getFilteredClusterNames(
  applications: Application[],
  account: string,
  kind: string,
  namespace: string,
  includeSpinnakerKinds: string[],
): string[] {
  if (!account || !kind || !namespace) {
    return [];
  }
  // If the only whitelisted Spinnaker kind is `serverGroups`, exclude server groups with `serverGroupManagers`.
  // This effectively excludes Deployment-managed ReplicaSets.
  const includeServerGroupsWithManagers: boolean =
    isEmpty(includeSpinnakerKinds) || includeSpinnakerKinds.length > 1 || includeSpinnakerKinds[0] !== 'serverGroups';
  const filter = (serverGroup: IServerGroup): boolean => {
    const accountAndNamespaceFilter: boolean = AppListExtractor.clusterFilterForCredentialsAndRegion(
      account,
      namespace,
    )(serverGroup);
    const hasServerGroupManagers: boolean = get(serverGroup, 'serverGroupManagers.length', 0) > 0;
    const serverGroupManagerFilter: boolean = includeServerGroupsWithManagers || !hasServerGroupManagers;
    const nameToParseKind: string = hasServerGroupManagers ? serverGroup.cluster : serverGroup.name;
    const kindFilter: boolean = parseSpinnakerName(nameToParseKind).kind === kind;
    return accountAndNamespaceFilter && serverGroupManagerFilter && kindFilter;
  };
  return AppListExtractor.getClusters(applications, filter);
}
