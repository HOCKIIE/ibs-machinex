export interface MetaType {
    current_page : string;
    from: string;
    last_page: string;
    links: [{
        active: string;
        label: string;
        url: string | null;
    }];
    path : string;
    per_page : string;
    to : string;
    total : string;
}