import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TransactionService } from '../transaction.service';
import { Transaction } from '../transaction';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

constructor(
    private navCtrl: NavController,
    private transactionService: TransactionService
  ) {}

  transactions: Transaction[] = [];

  ngOnInit() {
    this.loadTransactions();
  }

  ionViewDidEnter() {
    this.loadTransactions();
  }

   loadTransactions() {
    this.transactionService.getTransactions().subscribe({
      next: (response) => { this.transactions = response, console.log('Transactions loaded', this.transactions); },
      error: (err) => { console.error('Failed to load transactions', err); }
    });
  }
  }

