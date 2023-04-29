import { Node } from 'cc';

import { IMvvmMember } from './i-member';
import { MvvmMapping } from './mapping';

export abstract class MvvmMemerFactoryBase {
    public static ctor = 'MvvmMemerFactoryBase';
    public static nodeInitAction: (node: Node, parentNode: Node, viewID: string, input: any) => Promise<void>;

    public abstract build(mapping: MvvmMapping, parentNode: Node): IMvvmMember;
}