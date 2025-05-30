import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { Router } from '@angular/router';

interface Transaction {
  trans_id: number;
  Amount: number;
  Category: string;
  Date: string;
  Type: 'Income' | 'Expense';
}

@Component({
  selector: 'app-balance',
  standalone: false,
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class BalanceComponent implements OnInit {
  transactions: Transaction[] = [];
  categorySums: { [key: string]: number } = {};
  totalIncome = 0;
  totalExpenses = 0;
  netBalance = 0;

  // For grouping by date/time if needed
  transactionsByDate: {
    date: string;
    transactions: Transaction[];
    total: number;
  }[] = [];
  transactionsByTime: {
    timePeriod: string;
    transactions: Transaction[];
    total: number;
  }[] = [];

  constructor(private transactionService: TransactionService,
              private router: Router
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getTransactions().subscribe({
      next: (data: Transaction[]) => {
        this.transactions = data;
        this.calculateSums();
        this.groupTransactionsByDate();
        this.groupTransactionsByTime();
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
      },
    });
  }

  calculateSums() {
    this.categorySums = {};
    this.totalIncome = this.transactions
      .filter((t) => t.Type === 'Income')
      .reduce((sum, t) => sum + t.Amount, 0);

    this.totalExpenses = this.transactions
      .filter((t) => t.Type === 'Expense')
      .reduce((sum, t) => sum + t.Amount, 0);

    this.netBalance = this.totalIncome - this.totalExpenses;

    this.transactions.forEach((t) => {
      if (!this.categorySums[t.Category]) {
        this.categorySums[t.Category] = 0;
      }
      this.categorySums[t.Category] += t.Amount;
    });
  }

  groupTransactionsByDate() {
    const grouped = this.transactions.reduce((acc, transaction) => {
      const date = transaction.Date;
      if (!acc[date]) {
        acc[date] = { date, transactions: [], total: 0 };
      }
      acc[date].transactions.push(transaction);
      acc[date].total += transaction.Amount;
      return acc;
    }, {} as { [key: string]: { date: string; transactions: Transaction[]; total: number } });

    this.transactionsByDate = Object.values(grouped);
  }

  groupTransactionsByTime() {
    const timePeriods = [
      { label: 'Morning', start: 0, end: 11 },
      { label: 'Afternoon', start: 12, end: 17 },
      { label: 'Evening', start: 18, end: 23 },
    ];

    const grouped = this.transactions.reduce((acc, transaction) => {
      const hour = new Date(transaction.Date).getHours();
      const timePeriod =
        timePeriods.find((tp) => hour >= tp.start && hour <= tp.end)?.label ||
        'Unknown';

      if (!acc[timePeriod]) {
        acc[timePeriod] = { timePeriod, transactions: [], total: 0 };
      }
      acc[timePeriod].transactions.push(transaction);
      acc[timePeriod].total += transaction.Amount;
      return acc;
    }, {} as { [key: string]: { timePeriod: string; transactions: Transaction[]; total: number } });

    this.transactionsByTime = Object.values(grouped);
  }

  getIncomeCategoryKeys(): string[] {
    // Return only categories that have at least one Income transaction
    return Object.keys(this.categorySums).filter((category) =>
      this.transactions.some(
        (t) => t.Category === category && t.Type === 'Income'
      )
    );
  }

  getExpenseCategoryKeys(): string[] {
    // Return only categories that have at least one Expense transaction
    return Object.keys(this.categorySums).filter((category) =>
      this.transactions.some(
        (t) => t.Category === category && t.Type === 'Expense'
      )
    );
  }

  editTransaction(transaction: Transaction) {
    // Navigate to the edit form page and pass the transaction id as a route parameter
    // You need to inject Router in the constructor: private router: Router
    this.router.navigate(['/form'], {
      state: { transaction }
    });
  }

  presentDeleteAlert(transaction: Transaction) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.deleteTransaction(transaction);
    }
  }

  deleteTransaction(transaction: Transaction) {
    this.transactionService.deleteTransaction(transaction.trans_id).subscribe({
      next: () => {
        // Remove from local array after successful deletion
        this.transactions = this.transactions.filter(
          (t) => t.trans_id !== transaction.trans_id
        );
        this.calculateSums();
        this.groupTransactionsByDate();
        this.groupTransactionsByTime();
      },
      error: (err) => {
        console.error('Error deleting transaction:', err);
      },
    });
  }
}
