import { Node } from 'cc';
import { AssetLoaderBase } from 'lite-ts-cc-asset';

import { MvvmMapping } from './mapping';
import { MvvmMember } from './member';
import { MvvmMemerFactoryBase } from './member-factory-base';

export class CcMvvmMemberFactory extends MvvmMemerFactoryBase {
    public constructor(
        private m_AssetLoader: AssetLoaderBase,
    ) {
        super();
    }

    public build(mapping: MvvmMapping, parenNode: Node) {
        return new MvvmMember(this.m_AssetLoader, mapping, parenNode);
    }
}