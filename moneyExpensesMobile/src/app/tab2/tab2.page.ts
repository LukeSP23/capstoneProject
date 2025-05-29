import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TransactionService } from '../transaction.service';
import { Transaction } from '../transaction';
import { ActivatedRoute } from '@angular/router';
import type { OverlayEventDetail } from '@ionic/core';
import { AlertController } from '@ionic/angular';


import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

  transaction: FormGroup;

  constructor(
    private navCtrl: NavController,
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
      private alertController: AlertController,

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

  ionViewDidEnter() {
    this.loadTransactions();
  }

  loadTransactions() {
    this.transactionService.getTransactions().subscribe({
      next: (response) => {
        (this.transactions = response),
          console.log('Transactions loaded', this.transactions);
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
      },
    });
  }

  editTransaction(transaction: Transaction) {
    this.navCtrl.navigateForward(['/tabs/tab3'], {
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
            role: 'cancel'
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => {
              this.deleteTransaction(transaction);
            }
          }
        ]
      });
      await alert.present();
    }

}
