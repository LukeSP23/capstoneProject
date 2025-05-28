export interface Transaction {
  trans_id: number;
  Amount: number;
  Category: string;
  Date: string;
  Type: 'Expense' | 'Income';
}
