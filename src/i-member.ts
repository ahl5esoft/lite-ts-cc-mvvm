export type MvvmGetter = {
    key: string;
    getValueFunc: () => any;
};

export interface IMvvmMember {
    readonly getters: MvvmGetter[];
    bindEvent(): void;
    setValue(prop: string, value: any): Promise<void>;
}