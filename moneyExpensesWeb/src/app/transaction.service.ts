import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from './transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  transUrl = 'http://localhost:3000';

  constructor(private httpClientInstance: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.httpClientInstance.get<Transaction[]>(
      this.transUrl + '/transaction/all'
    );
  }

  // get transaction by id
  getTransaction(trans_id: number): Observable<Transaction> {
    return this.httpClientInstance.get<Transaction>(
      this.transUrl + '/transactions/' + trans_id
    );
  }

  // add transaction
  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.httpClientInstance.post<Transaction>(
      this.transUrl + '/transaction/add',
      transaction
    );
  }

  // update transaction data
  updateTransaction(transaction: Transaction) {
    console.log(
      this.transUrl + `/transaction/update/${transaction.trans_id}`,
      transaction
    );
    return this.httpClientInstance.put(
      this.transUrl + `/transaction/update/${transaction.trans_id}`,
      transaction
    );
  }

  // delete transaction by id
  deleteTransaction(trans_id: number): Observable<Transaction> {
    return this.httpClientInstance.delete<Transaction>(
      this.transUrl + '/transaction/delete/' + trans_id
    );
  }
}
