import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../transaction.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: false,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  incomeForm!: FormGroup;
  expenseForm!: FormGroup;
  editingTransId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.incomeForm = this.fb.group({
      Amount: [0, [Validators.required, Validators.min(0.01)]],
      Category: ['', [Validators.required]],
      Date: ['', [Validators.required]],
    });

    this.expenseForm = this.fb.group({
      Amount: [0, [Validators.required, Validators.min(0.01)]],
      Category: ['', [Validators.required]],
      Date: ['', [Validators.required]],
    });

    // Autofill if editing
    const transaction = history.state.transaction;
    if (transaction) {
      this.editingTransId = transaction.trans_id;
      if (transaction.Type === 'Income') {
        this.incomeForm.patchValue({
          Amount: transaction.Amount,
          Category: transaction.Category,
          Date: this.formatDateForInput(transaction.Date),
        });
      } else if (transaction.Type === 'Expense') {
        this.expenseForm.patchValue({
          Amount: transaction.Amount,
          Category: transaction.Category,
          Date: this.formatDateForInput(transaction.Date),
        });
      }
    }
  }

  private formatDateForInput(dateStr: string): string {
    return dateStr ? new Date(dateStr).toISOString().substring(0, 10) : '';
  }

  onSubmit(type: 'Expense' | 'Income') {
    const form = type === 'Expense' ? this.expenseForm : this.incomeForm;

    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });

    if (form.invalid) {
      alert(
        'Please fill out all required fields correctly (Select a valid date)'
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
      console.log('Transaction Update occurred in the wrong place');
    } else {
      // ADD mode
      this.transactionService.addTransaction(transactionData).subscribe({
        next: () => {
          alert('Transaction added successfully!');
          form.reset();
          this.router.navigate(['/balance']);
        },
        error: () => {
          alert('Failed to add transaction');
        },
      });
    }
  }
}
