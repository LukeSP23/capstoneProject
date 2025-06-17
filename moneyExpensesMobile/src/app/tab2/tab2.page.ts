import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '../transaction';
import { ActivatedRoute, Router } from '@angular/router';
import type { OverlayEventDetail } from '@ionic/core';
import { AlertController } from '@ionic/angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  transaction: FormGroup;
  categorySums: { [key: string]: number } = {};
  showIncomeCategories = false;
  showExpenseCategories = false;
  totalIncome = 0;
totalExpenses = 0;
netBalance = 0;
showDateGroups = false;
showTimeGroups = false;
transactionsByDate: { date: string; transactions: Transaction[]; total: number }[] = [];
transactionsByTime: { timePeriod: string; transactions: Transaction[]; total: number }[] = [];

  constructor(
    private navCtrl: NavController,
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private alertController: AlertController
  ) {
    this.transaction = this.fb.group({
      Amount: ['', Validators.required],
      Category: ['', Validators.required],
      Date: ['', Validators.required],
      Type: ['', Validators.required],
    });
  }

  transactions: Transaction[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params && params['trans_id']) {
        this.transaction.patchValue({
          Amount: params['Amount'] || '',
          Category: params['Category'] || '',
          Date: params['Date'] || '',
          Type: params['Type'] || '',
        });
      }
    });
    this.loadTransactions();
  }

  ionViewWillEnter() {
  this.route.queryParams.subscribe(params => {
    if (params['refresh']) {
      this.loadTransactions();
      this.router.navigate([], {
        queryParams: { refresh: null },
        queryParamsHandling: 'merge'
      });
    }
  });
}

  getCategoryKeys(): string[] {
    return Object.keys(this.categorySums);
  }

  calculateCategorySums() {
    this.categorySums = {};
     this.totalIncome = 0;
  this.totalExpenses = 0;

    this.transactions.forEach((transaction) => {
      if (!this.categorySums[transaction.Category]) {
        this.categorySums[transaction.Category] = 0;
      }

      if (transaction.Type === 'Income') {
        this.categorySums[transaction.Category] += transaction.Amount;
        this.totalIncome += transaction.Amount;
      } else {
        this.categorySums[transaction.Category] -= transaction.Amount;
        this.totalExpenses += transaction.Amount;
      }
    });
    this.netBalance = this.totalIncome - this.totalExpenses;
  }

  toggleIncomeCategories() {
    this.showIncomeCategories = !this.showIncomeCategories;
  }

  toggleExpenseCategories() {
    this.showExpenseCategories = !this.showExpenseCategories;
  }

  getIncomeCategoryKeys(): string[] {
    return Object.keys(this.categorySums).filter((category) => {
      return this.transactions.some(
        (t) => t.Category === category && t.Type === 'Income'
      );
    });
  }

  getExpenseCategoryKeys(): string[] {
    return Object.keys(this.categorySums).filter((category) => {
      return this.transactions.some(
        (t) => t.Category === category && t.Type === 'Expense'
      );
    });
  }

  toggleDateGroups() {
  this.showDateGroups = !this.showDateGroups;
}

toggleTimeGroups() {
  this.showTimeGroups = !this.showTimeGroups;
}

groupTransactionsByDate() {
  const groupsMap = new Map<string, Transaction[]>();
  
  this.transactions.forEach(transaction => {
    const dateStr = new Date(transaction.Date).toDateString();
    if (!groupsMap.has(dateStr)) {
      groupsMap.set(dateStr, []);
    }
    groupsMap.get(dateStr)?.push(transaction);
  });
  
  this.transactionsByDate = Array.from(groupsMap.entries()).map(([date, transactions]) => {
    const total = transactions.reduce((sum, t) => {
      return t.Type === 'Income' ? sum + t.Amount : sum - t.Amount;
    }, 0);
    return { date, transactions, total };
  });
  
  // Sort by date (newest first)
  this.transactionsByDate.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

groupTransactionsByTime() {
  const morning: Transaction[] = [];
  const afternoon: Transaction[] = [];
  const evening: Transaction[] = [];
  const night: Transaction[] = [];
  
  this.transactions.forEach(transaction => {
    const date = new Date(transaction.Date);
    const hours = date.getHours();
    
    if (hours >= 5 && hours < 12) {
      morning.push(transaction);
    } else if (hours >= 12 && hours < 17) {
      afternoon.push(transaction);
    } else if (hours >= 17 && hours < 21) {
      evening.push(transaction);
    } else {
      night.push(transaction);
    }
  });
  
  this.transactionsByTime = [
    { 
      timePeriod: 'Morning (5AM-12PM)', 
      transactions: morning,
      total: this.calculateTimeGroupTotal(morning)
    },
    { 
      timePeriod: 'Afternoon (12PM-5PM)', 
      transactions: afternoon,
      total: this.calculateTimeGroupTotal(afternoon)
    },
    { 
      timePeriod: 'Evening (5PM-9PM)', 
      transactions: evening,
      total: this.calculateTimeGroupTotal(evening)
    },
    { 
      timePeriod: 'Night (9PM-5AM)', 
      transactions: night,
      total: this.calculateTimeGroupTotal(night)
    }
  ];
}

private calculateTimeGroupTotal(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => {
    return t.Type === 'Income' ? sum + t.Amount : sum - t.Amount;
  }, 0);
}

  loadTransactions() {
    this.transactionService.getTransactions().subscribe({
      next: (response) => {
        this.transactions = response;
        this.calculateCategorySums();
        this.groupTransactionsByDate(); 
      this.groupTransactionsByTime();  
        console.log('Transactions loaded', this.transactions);
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
      },
    });
  }

  editTransaction(transaction: Transaction) {
    this.navCtrl.navigateForward(['/edit-form'], {
      queryParams: {
      trans_id: transaction.trans_id,
      Amount: transaction.Amount,
      Category: transaction.Category,
      Date: transaction.Date,
      Type: transaction.Type,
      },
    });
  }

  deleteTransaction(transaction: Transaction) {
    this.transactionService.deleteTransaction(transaction.trans_id).subscribe({
      next: () => {
        this.loadTransactions();
        console.log('Transaction deleted');
      },
      error: (err) => {
        console.error('Failed to delete transaction', err);
      },
    });
  }

  async presentDeleteAlert(transaction: Transaction) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this transaction?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteTransaction(transaction);
          },
        },
      ],
    });
    await alert.present();
  }

  handleReorder(event: CustomEvent) {
    const movedItem = this.transactions.splice(event.detail.from, 1)[0];
    this.transactions.splice(event.detail.to, 0, movedItem);

    event.detail.complete();
  }
}
