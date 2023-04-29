import { Component, SpriteFrame } from 'cc';
import { AssetLoaderBase } from 'lite-ts-cc-asset';

import { IMvvmMemberSetter } from './i-member-setter';

export class MvvmComponentMemberSetter implements IMvvmMemberSetter {
    public constructor(
        private m_AssetLoader: AssetLoaderBase,
        private m_Component: Component,
        private m_Member: string,
    ) { }

    public setValue(v: any) {
        if (this.m_Member == 'spriteFrame') {
            this.m_AssetLoader.load(SpriteFrame, `${v}`).then(res => {
                this.m_Component[this.m_Member] = res;
            })
        } else {
            this.m_Component[this.m_Member] = v;
        }
    }
}