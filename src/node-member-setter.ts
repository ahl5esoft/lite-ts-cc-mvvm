import { Node } from 'cc';

import { IMvvmMemberSetter } from './i-member-setter';

export class MvvmNodeMemberSetter implements IMvvmMemberSetter {
    public constructor(
        private m_Node: Node,
        private m_Member: string,
    ) { }

    public setValue(v: any) {
        this.m_Node[this.m_Member] = v;
    }
}