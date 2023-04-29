import * as cc from 'cc';

import { IMvvmMemberSetter } from './i-member-setter';
import { MvvmMappingSetterItem } from './mapping';

export class MvvmTweenMemberSetter implements IMvvmMemberSetter {
    public constructor(
        private m_Node: cc.Node,
        private m_Items: MvvmMappingSetterItem[],
    ) { }

    public setValue(v: any) {
        this.m_Items.reduce((memo, r) => {
            return memo ? memo[r.method](
                ...(r.args ?? []).map(cr => {
                    let argParts = cr.split('.');
                    if (argParts.length == 2) {
                        return () => {
                            const component = this.m_Node.getComponent(argParts[0]);
                            component[argParts[1]](this.m_Node);
                        };
                    }

                    return v[cr];
                })
            ) : cc.tween(
                r.args?.length ? this.m_Node.getComponent(cc[r.args[0]]) : this.m_Node
            );
        }, null as cc.Tween<any>).start();
    }
}