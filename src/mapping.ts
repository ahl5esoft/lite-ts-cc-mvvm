export type MvvmMappingSetterItem = {
    method: string;
    args?: string[];
};

export type MvvmMapping = {
    path: string;
    type: string;
    getter: { [key: string]: string; };
    setter: { [key: string]: string | MvvmMappingSetterItem[]; };
    events: {
        component: string;
        handler: string;
        type: string;
        customEventData?: string;
    }[];
};