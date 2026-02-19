export interface Account {
    id: string;
    name: string;
    type: 'GROUP' | 'CATEGORY' | 'ACCOUNT';
    parentId?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
    quota: {
        limit: number;
        used: number;
    };
    children?: Account[];
}

export interface TreeState {
    expandedIds: string[];
    selectedIds: string[];
    searchQuery: string;
}
