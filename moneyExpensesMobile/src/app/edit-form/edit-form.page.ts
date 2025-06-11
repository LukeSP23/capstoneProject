import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../transaction.service';
import { ToastController } from '@ionic/angular';
import { Transaction } from '../transaction';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.page.html',
  styleUrls: ['./edit-form.page.scss'],
  standalone: false,
})
export class EditFormPage implements OnInit {
  editForm!: FormGroup;
  isIncome: boolean = false;
  transactionId: number | null = null;

  categoryOptions: { value: string; label: string }[] = [];

  incomeCategories = [
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'gift', label: 'Gift' },
    { value: 'investment', label: 'Investment' },
    { value: 'Other', label: 'Other' },
  ];

  expenseCategories = [
    { value: 'housing', label: 'Housing' },
    { value: 'food', label: 'Food' },
    { value: 'transport', label: 'Transport' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      Amount: [0, [Validators.required, Validators.min(0)]],
      Category: ['', [Validators.required]],
      Date: ['', [Validators.required]],
      Type: ['', [Validators.required]],
    });

    this.route.queryParams.subscribe((params) => {
      if (params) {
        this.transactionId = params['trans_id'] ? +params['trans_id'] : null;
        this.isIncome = params['Type'] === 'Income';

        this.categoryOptions = this.isIncome
          ? this.incomeCategories
          : this.expenseCategories;

        this.editForm.patchValue({
          Amount: params['Amount'] || 0,
          Category: params['Category'] || '',
          Date: params['Date']
            ? new Date(params['Date']).toISOString()
            : new Date().toISOString(),
          Type: params['Type'] || '',
        });
      }
    });
  }

  cancelEdit() {
    this.router.navigate(['/tabs/tab2']);
  }

  async onSubmit() {
    if (this.editForm.invalid) {
      const toast = await this.toastController.create({
        message: 'Please fill out all fields correctly',
        duration: 3000,
        position: 'top',
        color: 'danger',
      });
      await toast.present();
      return;
    }

    const transactionData: Transaction = {
      trans_id: this.transactionId || 0,
      ...this.editForm.value,
    };

    if (this.transactionId) {
      // Update existing transaction
      this.transactionService.updateTransaction(transactionData).subscribe(
        async () => {
          const toast = await this.toastController.create({
            message: 'Transaction updated successfully!',
            duration: 2000,
            position: 'top',
            color: 'success',
          });
          await toast.present();
          this.router.navigate(['/tabs/tab2'], {
            queryParams: { refresh: true },
          });
        },
        async (error) => {
          console.error('Error updating transaction', error);
          const toast = await this.toastController.create({
            message: 'Failed to update transaction',
            duration: 3000,
            position: 'top',
            color: 'danger',
          });
          await toast.present();
        }
      );
    } else {
      // Create new transaction (though this page is primarily for editing)
      this.transactionService.addTransaction(transactionData).subscribe(
        async () => {
          const toast = await this.toastController.create({
            message: 'Transaction added successfully!',
            duration: 2000,
            position: 'top',
            color: 'success',
          });
          await toast.present();
          this.router.navigate(['/tabs/tab2']);
        },
        async (error) => {
          console.error('Error adding transaction', error);
          const toast = await this.toastController.create({
            message: 'Failed to add transaction',
            duration: 3000,
            position: 'top',
            color: 'danger',
          });
          await toast.present();
        }
      );
    }
  }
}
