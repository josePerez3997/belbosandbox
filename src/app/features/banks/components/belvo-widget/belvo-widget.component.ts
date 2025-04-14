import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BelvoService } from '../../services/belvo.service';

declare global {
  interface Window {
    belvoSDK: any;
  }
}

@Component({
  selector: 'app-belvo-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './belvo-widget.component.html',
  styleUrl: './belvo-widget.component.scss'
})
export class BelvoWidgetComponent implements OnInit, OnDestroy {
  @Input() bankId!: string;
  @Input() country: string = 'MX';

  @Output() success = new EventEmitter<string>();
  @Output() exit = new EventEmitter<void>();
  @Output() error = new EventEmitter<any>();

  isLoading = true;
  errorMessage = '';
  private scriptElement: HTMLScriptElement | null = null;

  constructor(private belvoService: BelvoService) { }

  ngOnInit() {
    this.loadWidget();
  }

  ngOnDestroy() {
    if (this.scriptElement && this.scriptElement.parentNode) {
      this.scriptElement.parentNode.removeChild(this.scriptElement);
    }
  }

  retry() {
    this.isLoading = true;
    this.errorMessage = '';
    this.loadWidget();
  }

  private loadWidget() {
    if (!window.belvoSDK) {
      this.scriptElement = document.createElement('script');
      this.scriptElement.src = 'https://cdn.belvo.io/belvo-widget-1-stable.js';
      this.scriptElement.async = true;
      this.scriptElement.onload = () => this.initializeWidget();
      this.scriptElement.onerror = () => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar el widget de Belvo. Por favor, recarga la página.';
      };
      document.body.appendChild(this.scriptElement);
    } else {
      this.initializeWidget();
    }
  }

  private initializeWidget() {
    this.belvoService.getAccessToken().subscribe({
      next: (data) => {
        const accessToken = data.access;
        this.createWidget(accessToken);
      },
      error: (err) => {
        console.error('Error al obtener token:', err);
        this.isLoading = false;
        this.errorMessage = 'Error al conectar con el servidor. Por favor, intenta de nuevo.';
        this.error.emit(err);
      }
    });
  }

  private createWidget(accessToken: string) {
    try {
      interface BelvoWidgetConfig {
        locale: string;
        country_codes: string[];
        institution?: string;
        callback: (link: string, institution: string) => void;
        onExit: () => void;
        onError: (error: any) => void;
      }

      const config: BelvoWidgetConfig = {
        locale: 'es',
        country_codes: [this.country],
        callback: (link: string, institution: string) => {
          console.log('Link creado:', link, 'para institución:', institution);

          this.belvoService.registerLink(link, institution).subscribe({
            next: () => {
              this.success.emit(link);
            },
            error: (err) => {
              console.error('Error al registrar link:', err);
              this.error.emit(err);
            }
          });
        },
        onExit: () => {
          console.log('Usuario cerró el widget');
          this.exit.emit();
        },
        onError: (error: any) => {
          console.error('Error en el widget:', error);
          this.error.emit(error);
        }
      };

      if (this.bankId) {
        config.institution = this.bankId;
      }

      window.belvoSDK.createWidget(accessToken, config).build();
      this.isLoading = false;
    } catch (error) {
      console.error('Error al crear widget:', error);
      this.isLoading = false;
      this.errorMessage = 'Error al inicializar el widget. Por favor, intenta de nuevo.';
      this.error.emit(error);
    }
  }
}
