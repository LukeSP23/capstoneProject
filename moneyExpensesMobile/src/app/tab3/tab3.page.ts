import { Component, OnInit, Type } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Transaction } from '../transaction';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  constructor(
    private navCtrl: NavController,
    private transactionService: TransactionService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  incomeForm!: FormGroup;
  expenseForm!: FormGroup;
  editingTransId: number | null = null;

  ngOnInit() {
    this.incomeForm = this.formBuilder.group({
      Amount: [0, [Validators.required, Validators.min(0)]],
      Category: ['', [Validators.required]],
      Date: ['', [Validators.required]],
    });

    this.expenseForm = this.formBuilder.group({
      Amount: [0, [Validators.required, Validators.min(0)]],
      Category: ['', [Validators.required]],
      Date: ['', [Validators.required]],
    });

    this.route.queryParams.subscribe((params) => {
      if (params && params['trans_id']) {
        this.editingTransId = +params['trans_id'];
        if (params['Type'] === 'Income') {
          this.incomeForm.patchValue({
            Amount: params['Amount'] || '',
            Category: params['Category'] || '',
            Date: params['Date'] ? new Date(params['Date']).toISOString() : '',
          });
        } else if (params['Type'] === 'Expense') {
          this.expenseForm.patchValue({
            Amount: params['Amount'] || '',
            Category: params['Category'] || '',
            Date: params['Date'] ? new Date(params['Date']).toISOString() : '',
          });
        }
      } else {
        this.editingTransId = null;
      }
    });
  }

  async presentToast(
    position: 'top' | 'middle' | 'bottom',
    message: string,
    duration: number,
    color?:
      | 'primary'
      | 'secondary'
      | 'tertiary'
      | 'success'
      | 'warning'
      | 'danger'
  ) {
    const toast = await this.toastController.create({
      message,
      duration,
      position,
      color,
    });

    await toast.present();
  }

  async onSubmit(type: 'Expense' | 'Income') {
    const form = type === 'Expense' ? this.expenseForm : this.incomeForm;

    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });

    if (form.invalid) {
      await this.presentToast(
        'top',
        'Please fill out all required fields correctly (Select a valid date)',
        3000,
        'danger'
      );
      return;
    }

    const transactionData = {
      trans_id: this.editingTransId ?? 0,
      Amount: form.value.Amount,
      Category: form.value.Category,
      Date: form.value.Date,
      Type: type,
    };

    if (this.editingTransId) {
      // EDIT mode
      this.transactionService.updateTransaction(transactionData).subscribe(
        async (response) => {
          this.navCtrl.navigateBack('/tabs/tab2');
          await this.presentToast(
            'top',
            'Transaction updated successfully!',
            2000,
            'success'
          );
          form.reset();
          this.editingTransId = null;
        },
        async (error) => {
          console.error('Error updating transaction', error);
          await this.presentToast(
            'top',
            'Failed to update transaction',
            3000,
            'danger'
          );
        }
      );
    } else {
      this.transactionService.addTransaction(transactionData).subscribe(
        async (response) => {
          console.log('Transaction added!', response);
          await this.presentToast(
            'top',
            'Transaction added successfully!',
            2000,
            'success'
          );
          form.reset();
        },
        async (error) => {
          console.error('Error adding transaction', error);
          await this.presentToast(
            'top',
            'Failed to add transaction',
            3000,
            'danger'
          );
        }
      );
    }
  }
}
