import { instantiate, Node, Prefab } from 'cc';
import { AssetLoaderBase } from 'lite-ts-cc-asset';

import { IMvvmMemberSetter } from './i-member-setter';
import { MvvmMapping } from './mapping';
import { MvvmMemerFactoryBase } from './member-factory-base';

export type MvvmPrefabVm = {
    _index: number;
    _prefab?: string;
};

export class MvvmPrefabMemberSetter implements IMvvmMemberSetter {
    private m_Children: { [index: number]: Node; } = {};

    public get getters() {
        return [];
    }

    public constructor(
        private m_AssetLoader: AssetLoaderBase,
        private m_Mapping: MvvmMapping,
        private m_ParentNode: Node,
    ) { }

    public bindEvent() { }

    public setValue(values: MvvmPrefabVm[]) {
        const tasks = values.map(async r => {
            if (r._index > 0) {
                const prefabPath = r._prefab ?? this.m_Mapping.path;
                if (this.m_Children[r._index])
                    return;

                const prefab = await this.m_AssetLoader.load(Prefab, prefabPath);
                this.m_Children[r._index] = instantiate(prefab);
                this.m_Children[r._index].setSiblingIndex(r._index);
                await MvvmMemerFactoryBase.nodeInitAction(
                    this.m_Children[r._index],
                    this.m_ParentNode,
                    prefabPath.replace('.prefab', ''),
                    r,
                );
            } else {
                const index = Math.abs(r._index);
                this.m_Children[index].destroy();
                delete this.m_Children[index];
            }
        });
        Promise.all(tasks).catch(console.error);
    }
}