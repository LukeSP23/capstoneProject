import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../transaction.service';
import { Location } from '@angular/common';

interface CategoryOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
  standalone: false,
})
export class EditFormComponent implements OnInit {
  editForm!: FormGroup;
  isIncome: boolean = false;
  transactionId: number | null = null;
  categoryOptions: CategoryOption[] = [];

  incomeCategories: CategoryOption[] = [
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'gift', label: 'Gift' },
    { value: 'investment', label: 'Investment' },
    { value: 'Other', label: 'Other' },
  ];

  expenseCategories: CategoryOption[] = [
    { value: 'housing', label: 'Housing' },
    { value: 'food', label: 'Food' },
    { value: 'transport', label: 'Transport' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      Amount: [0, [Validators.required, Validators.min(0.01)]],
      Category: ['', Validators.required],
      Date: ['', Validators.required],
      Type: ['', Validators.required],
    });

    // Get transaction data from route state
        const state = history.state as { transaction: any };
   
        if (state && state.transaction) {
      this.transactionId = state.transaction.trans_id;
      this.isIncome = state.transaction.Type === 'Income';
      this.categoryOptions = this.isIncome
        ? this.incomeCategories
        : this.expenseCategories;

      this.editForm.patchValue({
        Amount: state.transaction.Amount,
        Category: state.transaction.Category,
        Date: this.formatDateForInput(state.transaction.Date),
        Type: state.transaction.Type,
      });
    }
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.markFormGroupTouched(this.editForm);
      return;
    }

    const transactionData = {
      trans_id: this.transactionId || 0,
      ...this.editForm.value,
    };

    if (this.transactionId) {
      // Update existing transaction
      this.transactionService.updateTransaction(transactionData).subscribe({
        next: () => {
          this.router.navigate(['/balance']);
        },
        error: (err) => {
          console.error('Error updating transaction:', err);
          alert('Failed to update transaction');
        },
      });
    } else {
      // Shouldn't happen as this is an edit page, but handle just in case
      this.transactionService.addTransaction(transactionData).subscribe({
        next: () => {
          this.router.navigate(['/balance']);
        },
        error: (err) => {
          console.error('Error adding transaction:', err);
          alert('Failed to add transaction');
        },
      });
    }
  }

  onCancel(): void {
    this.location.back(); // Go back to previous page
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
