export interface Transaction {
    id: string;
    account: {
        id: string;
        name: string;
        number: string;
    };
    collected_at: string;
    value_date: string;
    accounting_date: string;
    amount: number;
    balance: number;
    currency: string;
    description: string;
    observations: string;
    category: string;
    subcategory: string;
    reference: string;
    type: string;
    status: string;
    created_at: string;
    internal_identification: string;
    merchant: {
        name: string;
        website: string;
        logo: string;
    };
    date: string;
}