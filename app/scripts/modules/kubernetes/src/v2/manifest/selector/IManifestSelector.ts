import { IManifestLabelSelectors } from './IManifestLabelSelector';

export interface IMultiManifestSelector extends IManifestSelector {
  kinds: string[];
  labelSelectors?: IManifestLabelSelectors;
}

export interface IManifestSelector {
  account: string;
  app?: string;
  cluster?: string;
  criteria?: string;
  kind?: string;
  kinds?: string[];
  labelSelectors?: IManifestLabelSelectors;
  location: string;
  manifestName?: string;
  mode?: SelectorMode;
}

export enum SelectorMode {
  Static = 'static',
  Dynamic = 'dynamic',
  Label = 'label',
}
