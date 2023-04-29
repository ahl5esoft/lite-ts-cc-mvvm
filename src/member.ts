import * as cc from 'cc';
import { AssetLoaderBase } from 'lite-ts-cc-asset';

import { MvvmComponentMemberSetter } from './component-member-setter';
import { IMvvmMember, MvvmGetter } from './i-member';
import { IMvvmMemberSetter } from './i-member-setter';
import { MvvmMapping } from './mapping';
import { MvvmNodeMemberSetter } from './node-member-setter';
import { MvvmPrefabMemberSetter } from './prefab-member-setter';
import { MvvmTweenMemberSetter } from './tween-member-setter';

export class MvvmMember implements IMvvmMember {
    private m_Getters: MvvmGetter[];
    public get getters() {
        this.m_Getters ??= Object.keys(this.m_Mapping.getter ?? {}).map(r => {
            return {
                key: r,
                getValueFunc: () => {
                    return (this.m_Mapping.type ? this.component : this.node)[this.m_Mapping.getter[r]];
                },
            }
        });
        return this.m_Getters;
    }

    private m_Component: cc.Component;
    protected get component() {
        if (!this.m_Component) {
            this.m_Component = this.node.getComponent(cc[this.m_Mapping.type]);
            if (!this.m_Component)
                throw new Error(`组件脚本无效: ${JSON.stringify(this.m_Mapping)}`);
        }

        return this.m_Component;
    }

    private m_Node: cc.Node;
    protected get node() {
        if (!this.m_Node) {
            this.m_Node = this.m_Mapping.path ? this.m_ParentNode.getChildByPath(this.m_Mapping.path) : this.m_ParentNode;
            if (!this.m_Node)
                throw new Error(`组件路径无效: ${JSON.stringify(this.m_Mapping)}`);
        }

        return this.m_Node;
    }

    private m_Setter: { [key: string]: IMvvmMemberSetter };
    protected get setter() {
        this.m_Setter ??= Object.keys(this.m_Mapping.setter ?? {}).reduce((memo, r) => {
            const v = this.m_Mapping.setter[r];
            if (typeof v == 'string') {
                if (v.includes('.prefab')) {
                    memo[r] = new MvvmPrefabMemberSetter(this.m_AssetLoader, {
                        ...this.m_Mapping,
                        path: v
                    }, this.node);
                } else {
                    memo[r] = this.m_Mapping.type ? new MvvmComponentMemberSetter(this.m_AssetLoader, this.component, v) : new MvvmNodeMemberSetter(this.node, v);
                }
            } else {
                memo[r] = new MvvmTweenMemberSetter(this.node, v);
            }
            return memo;
        }, {} as { [key: string]: IMvvmMemberSetter });
        return this.m_Setter;
    }

    public constructor(
        private m_AssetLoader: AssetLoaderBase,
        private m_Mapping: MvvmMapping,
        private m_ParentNode: cc.Node,
    ) { }

    public bindEvent() {
        if (!this.m_Mapping.events?.length)
            return;

        for (const cr of this.m_Mapping.events) {
            const eventHandler = new cc.Component.EventHandler();
            eventHandler.component = cr.component;
            eventHandler.handler = cr.handler;
            eventHandler.target = this.m_ParentNode;
            eventHandler.customEventData = cr.customEventData ?? undefined;
            this.component[cr.type].push(eventHandler);
        }
    }

    public async setValue(prop: string, value: any) {
        this.setter[prop]?.setValue(value);
    }
}