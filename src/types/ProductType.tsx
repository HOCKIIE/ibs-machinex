export interface ProductType {
    id: number;
    title_th: string;
    title_en: string;
    thumbnail: string;
    description_th: string;
    description_en: string;
    detail_th: string,
    detail_en: string,
    image: string;
    image_alt: string;
    color: string;
    brand: string;
    category: string;
    price: number;
    isActive: boolean;
    createdAt?:string;
    updatedAt?:string;
}

export interface ProductState {

    
    items: ProductType[];
    isLoading: boolean;
    error: string | null;
    total: number;
    lastPage: number;
    currPage: number;

    fetchItems: (type: string) => Promise<void>;
    fetchItemById: (id:number) => Promise<void>;
    createItem: (newItem: ProductType) => Promise<void>;
    updateItem: (id: number, updatedProduct: ProductType) => Promise<void>;
    deleteItem: (id:number) => Promise<void>;
  
}