import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IGroupedTransaction,
  IIncomingTransaction,
  IOutgoingTransaction,
  ITransaction,
  ITransactionPerMonth,
  ITransactionPerWeek,
} from '../models/ITransaction.interface';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private _http: HttpClient, private _datePipe: DatePipe) {}

  private apiUrl = 'https://localhost:7257/api/transactions';

  getTransactions(): Observable<ITransaction[]> {
    return this._http.get<ITransaction[]>(this.apiUrl);
    // GET /posts?_sort=views&_order=asc
  }

  addIncomingTransaction(
    newTransaction: IIncomingTransaction
  ): Observable<IIncomingTransaction> {
    return this._http.post<IIncomingTransaction>(this.apiUrl, newTransaction);
  }

  addOutgoingTransaction(
    newTransaction: IOutgoingTransaction
  ): Observable<IOutgoingTransaction> {
    return this._http.post<IOutgoingTransaction>(this.apiUrl, newTransaction);
  }

  groupTransactionByMonth(
    transactionList: ITransaction[]
  ): IGroupedTransaction {
    const groupedTransactions: IGroupedTransaction = {
      transactionPerMonth: [],
    };

    const currentYear = new Date().getFullYear();
    // const currentMonth = new Date().getMonth();
    const currentMonth = new Date(transactionList[0].date).getMonth();

    let transactionPerMonth: ITransactionPerMonth = {
      month: '',
      transactionPerWeek: [],
    };

    let transactionPerWeek: ITransactionPerWeek[] = [];

    for (let i = currentMonth; i >= 0; i--) {
      let currentMonthInStr: string | null = '';

      const currentMonthTransactions = transactionList.filter((t) => {
        const transactionDate = new Date(t.date);
        if (
          transactionDate.getMonth() === i &&
          transactionDate.getFullYear() === currentYear
        ) {
          currentMonthInStr = this._datePipe.transform(transactionDate, 'MMMM');
          return true;
        } else {
          return false;
        }
      });

      // Get date of the latest transaction
      const latestTransactionDate = transactionList[0].date;

      const weekInStr = this._datePipe.transform(latestTransactionDate, 'W');

      let weekInNum = weekInStr !== null ? parseInt(weekInStr) : 0;

      weekInNum = weekInNum != 5 ? weekInNum : 5;

      console.log('Latest week number: ', weekInNum);

      for (let i = 5; i > 0; i--) {
        const currentWeekTransactions = currentMonthTransactions.filter((t) => {
          const currentTWeekInStr = this._datePipe.transform(t.date, 'W');
          const currentTWeekInNum =
            currentTWeekInStr !== null ? parseInt(currentTWeekInStr) : 0;

          if (currentTWeekInNum === i) {
            return true;
          } else {
            return false;
          }
        });

        const newTransactionPerWeek: ITransactionPerWeek = {
          week: i,
          transactions: currentWeekTransactions,
        };

        transactionPerWeek.push(newTransactionPerWeek);
      }

      const newTransactionPerMonth: ITransactionPerMonth = {
        month: currentMonthInStr,
        transactionPerWeek: transactionPerWeek,
      };

      groupedTransactions.transactionPerMonth.push(newTransactionPerMonth);
      transactionPerWeek = [];
    }
    console.log('GroupedTransac: ', groupedTransactions);

    return groupedTransactions;
  }

  getTotalCapital(transactions: ITransaction[]) {
    let total = 0;
    transactions.forEach((t) => {
      if (t.type === 0) {
        total += t.amount;
      }
    });
    return total;
  }

  getTotalExpenses(transactions: ITransaction[]) {
    let total = 0;

    transactions.forEach((t) => {
      total += t.expenses;
    });

    return total;
  }

  getTotalRevenues(transaction: ITransaction[]) {
    let total = 0;
    transaction.forEach((t) => {
      if (t.type === 1) {
        total += t.amount;
      }
    });
    return total;
  }

  getReturnOfInvestment(transactions: ITransaction[]) {
    let returnOfInvestment = 0;
    const revenue = this.getTotalRevenues(transactions);
    const capital = this.getTotalCapital(transactions);

    returnOfInvestment = revenue - capital;

    returnOfInvestment =
      returnOfInvestment - this.getTotalExpenses(transactions);
    return returnOfInvestment;
  }

  getMonthlyCapital(weeklyTransactions: ITransactionPerWeek[]) {
    let monthlyCapital = 0;

    weeklyTransactions.forEach((wt) => {
      monthlyCapital += this.getTotalCapital(wt.transactions);
    });

    return monthlyCapital;
  }

  getMonthlyRevenue(weeklyTransactions: ITransactionPerWeek[]) {
    let monthlyRevenue = 0;

    weeklyTransactions.forEach((wt) => {
      monthlyRevenue += this.getTotalRevenues(wt.transactions);
    });

    return monthlyRevenue;
  }

  getMonthlyRoi(weeklyTransactions: ITransactionPerWeek[]) {
    let monthlyRoi = 0;

    weeklyTransactions.forEach((wt) => {
      monthlyRoi += this.getReturnOfInvestment(wt.transactions);
    });

    return monthlyRoi;
  }
}
