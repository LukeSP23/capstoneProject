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
    private route: ActivatedRoute
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

    // // get id of our transaction from the URL
    // this.route.paramMap.subscribe(
    //   (params) => {
    //     let id = params.get('trans_id');
    //     if (id) {
    // //       // get our transaction data from the server
    //       this.transactionService.getTransaction(parseInt(id)).subscribe(
    //         (response: Transaction) => {
    //           console.log('Get Transaction', response);
    // //           // update the form with the transaction data
    //           this.transaction.patchValue({
    //             Amount: response.Amount,
    //             Category: response.Category,
    //             Date: response.Date,
    //             Type: response.Type,
    //           });
    //         },
    //         (error) => {
    //           console.error('Error getting transaction from db', error);
    //         }
    //       );
    //     }
    //   },
    //   (error) => {
    //     console.error('Error getting transaction id from params', error);
    //   }
    // );
  }

  // get name() {
  //   return this.transaction.get('name');
  // }

  // async presentToast(
  //   position: 'top' | 'middle' | 'bottom',
  //   message: string,
  //   duration: number,
  //   color?:
  //     | 'primary'
  //     | 'secondary'
  //     | 'tertiary'
  //     | 'success'
  //     | 'warning'
  //     | 'danger'
  // ) {
  //   const toast = await this.toastController.create({
  //     message, // same as message: message,
  //     duration, // same as duration: duration,
  //     position, // same as position: position,
  //     color, // same as color: color,
  //   });

  //   await toast.present();
  // }

  closeForm() {
    this.navCtrl.navigateBack('/tabs/tab1');
  }

  onSubmit(type: 'Expense' | 'Income') {
    const form = type === 'Expense' ? this.expenseForm : this.incomeForm;
    // check if form is valid
    if (form.invalid) {
      console.log('Form is invalid!', form.errors);
      return;
    }

    // Create transaction data with the type and a default trans_id
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
        (response) => {
          console.log('Transaction updated!', response);
          form.reset();
          this.editingTransId = null;
        },
        (error) => {
          console.error('Error updating transaction', error);
        }
      );
    } else {
      this.transactionService.addTransaction(transactionData).subscribe(
        (response) => {
          console.log('Transaction added!', response);
          form.reset();
        },
        (error) => {
          console.error('Error adding transaction', error);
        }
      );
    }
  }
}
