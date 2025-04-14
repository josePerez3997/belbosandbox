import { Component, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsService } from '../../services/transactions.service';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { take } from 'rxjs';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);


@Component({
  standalone: true,
  selector: 'app-transaction-list',
  imports: [CommonModule, AsyncPipe, NgFor],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent implements AfterViewInit {
  private transactionsService = inject(TransactionsService);
  transactions$ = this.transactionsService.getTransactions();

  balance: number | null = null;
  ingresos: number = 0;
  egresos: number = 0;

  ngAfterViewInit() {
    this.transactions$.pipe(take(1)).subscribe((txs) => {
      this.ingresos = txs.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
      this.egresos = txs.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);
      this.balance = this.ingresos + this.egresos;

      const labels = txs.map(t => t.date);
      const data = txs.map(t => t.amount);

      const ctx = document.getElementById('transactionsChart') as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Movimientos',
                data,
                backgroundColor: data.map(v => v > 0 ? 'rgba(34,197,94,0.7)' : 'rgba(239,68,68,0.7)'),
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
            },
          },
        });
      }
    });
  }
}
