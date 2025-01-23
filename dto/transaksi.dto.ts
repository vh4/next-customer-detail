export interface transaksiDto {
  productID: string;
  productName: string;
  amount: string;
  customerName: string;
  status: number;
  transactionDate?: Date;
  createBy: string;
  createOn?: string; 
}
