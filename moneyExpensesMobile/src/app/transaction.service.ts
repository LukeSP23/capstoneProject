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
    
    return this.httpClientInstance.get<Transaction[]>(this.transUrl + '/transaction/all');
  }

  // get transaction by id
  // getTransaction(id: number): Observable<Transaction> {
  //   return this.httpClientInstance.get<Transaction>(
  //     this.schoolUrl + '/transactions/' + id
  //   );
  // }

  // add transaction
  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.httpClientInstance.post<Transaction>(
      this.transUrl + '/transaction/add',
      transaction
    );
  }

  // update transaction data
  // updateTransaction(id: number, updatedTransaction: Transaction): Observable<Transaction> {
  //   return this.httpClientInstance.patch<Transaction>(
  //     this.schoolUrl + '/transactions/' + id,
  //     updatedTransaction
  //   );
  // }

  // delete transaction by id
  // deleteTransaction(id: number): Observable<Transaction> {
  //   return this.httpClientInstance.delete<Transaction>(
  //     this.schoolUrl + '/transactions/' + id
  //   );
  // }
}
