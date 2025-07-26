import { Component, AfterViewChecked, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';

import { SessionService, ConnectionStatus } from 'src/app/services/seguridad/session.service'; // Importa el nuevo servicio

import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';

// Define tus tipos de mensaje si los recibes como JSON de Ollama y otros
interface OllamaChunk {
  content: string;
  done: boolean;
}

interface IncomingMessage { // Para otros tipos de mensaje que no sean Ollama chunks
  message: string;
  id: string;
  from: 'bot' | 'user' | 'system'; // 'system' para mensajes de estado/error
}


@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, OnDestroy {

  @ViewChild('messageList', { static: false }) messageListContainer!: ElementRef;

  public loading: boolean = false; // Indica si estamos esperando respuesta de Ollama
  public currentMessage: string = ''; // Mensaje actual en el input del usuario
  public messages: IncomingMessage[] = []; // Historial de mensajes mostrados en UI

  public connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  public ConnectionStatus = ConnectionStatus; // Hace el enum accesible en la plantilla HTML

  private userId: string = '';
  private wsMessagesSubscription!: Subscription;
  private wsStatusSubscription!: Subscription;

  // Propiedades para enviar mensajes directos a IDs de cliente (si aún las usas)
  msjx: string = '';
  idx: string = '';


  constructor(
    private utilService: UtilService,
    private sessionService: SessionService, 
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.userId = this.utilService.uuidv4();
    this.loadHistory(); // Carga el historial al iniciar
    // 1. Suscribirse a los mensajes del sessionService
    this.wsMessagesSubscription = this.sessionService.messages$.subscribe(
      (dataAsString) => {
        // Intenta parsear el JSON de los chunks de Ollama
        try {
          const data = JSON.parse(dataAsString);
          if (data && typeof data.content === 'string' && typeof data.done === 'boolean') {
            // Es un chunk de Ollama
            const lastMessage = this.messages[this.messages.length - 1];
            if (lastMessage && lastMessage.from === 'bot' && this.loading) {
              lastMessage.message += data.content;
            } else {
              this.messages.push({ from: 'bot', message: data.content, id: this.userId });
            }

            if (data.done) {
              console.log('ChatComponent: Respuesta de Ollama terminada.');
              this.loading = false;
              this.saveHistory();
            }
          } else if (data && typeof data.message === 'string' && typeof data.id === 'string' && typeof data.from === 'string') {
            // Es un mensaje general del servidor con formato predefinido
            this.messages.push({ from: data.from, message: data.message, id: data.id });
            this.loading = false; // No es una respuesta de Ollama
            this.saveHistory();
          } else {
            // Mensaje con formato inesperado
            console.warn('ChatComponent: Mensaje WebSocket con formato inesperado:', dataAsString);
            this.messages.push({ from: 'bot', message: String(dataAsString), id: this.userId });
            this.loading = false;
            this.saveHistory();
          }
        } catch (e) {
          // Error al parsear (podría ser un mensaje de texto plano o JSON inválido)
          console.error('ChatComponent: Error al parsear mensaje WebSocket:', e, 'Mensaje crudo:', dataAsString);
          this.messages.push({ from: 'bot', message: `Error de servidor: ${dataAsString.substring(0, 100)}...`, id: this.userId });
          this.loading = false;
          this.saveHistory();
        }
      },
      (error) => {
        // Maneja errores emitidos por el Subject de mensajes del servicio (ej. conexión irrecuperable)
        console.error('ChatComponent: Error del sessionService:', error);
        this.messages.push({ from: 'system', message: `Error fatal de conexión: ${error.message}`, id: 'system-error' });
        this.loading = false;
        this.saveHistory();
      }
    );

    // 2. Suscribirse al estado de la conexión del sessionService
    this.wsStatusSubscription = this.sessionService.connectionStatus$.subscribe(status => {
      this.connectionStatus = status;
      console.log('ChatComponent: Estado de conexión actualizado:', ConnectionStatus[status]);
      // Puedes añadir más lógica aquí para mostrar spinners, mensajes de UI, etc.
    });

    // 3. Conectar al sessionService al iniciar el componente
    this.sessionService.connect(this.userId);

    this.obtenerSesiones();
    
  }

  obtenerSesiones() {
    this.sessionService.getConnectedSessions().subscribe({
      next: (data) => {
        console.log(data)
      },
      error: (err) => {
        console.error('Error al obtener sesiones:', err);
      }
    });
  }


  

   // Método para enviar mensajes al servidor
  public sendMessage(): void {
    if (!this.currentMessage.trim()) {
      return;
    }

    const messageObject = {
      id: this.userId,
      message: this.currentMessage
    };
    const jsonMessage = JSON.stringify(messageObject);

    this.messages.push({ from: 'user', message: this.currentMessage, id: this.userId });
    this.loading = true; // Indica que estamos esperando respuesta de Ollama

    // Usa el servicio para enviar el mensaje
    this.sessionService.sendMessage(jsonMessage);

    this.currentMessage = '';
    this.saveHistory();
    this.scrollToBottom();
  }
 

  // Nuevo método para guardar el historial en localStorage.
  private saveHistory(): void {

    const historyString = JSON.stringify(this.messages);
    localStorage.setItem('chat_history', historyString);
  }

  // Nuevo método para cargar el historial desde localStorage.
  private loadHistory(): void {
    const historyString = localStorage.getItem('chat_history');
    if (historyString) {
      this.messages = JSON.parse(historyString);
    }
  }

  sendMClient(): void {
    let data = {
      'clientId': this.idx,
      'message': this.msjx
    }

    this.idx = ''
    this.msjx = ''

    this.sessionService.sendConnectedSessions(data).subscribe({
      next: (data) => {
        console.log(data)
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al enviar mensaje:', err)
        this.loading = false;
      }
    })
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.messageListContainer) {
        this.messageListContainer.nativeElement.scrollTop = this.messageListContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  formatMessage(message: string): string {
    if (!message) return '';
    return message.replace(/\n/g, '<br>');
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.wsMessagesSubscription) {
      this.wsMessagesSubscription.unsubscribe();
    }
    if (this.wsStatusSubscription) {
      this.wsStatusSubscription.unsubscribe();
    }
    // El servicio WebSocket se encargará de cerrar la conexión si el servicio se destruye
    // o si el navegador cierra la página.
  }
  // Método para desconectar manualmente (opcional, para un botón en la UI)
  public disconnect(): void {
    this.sessionService.closeConnection();
  }

  // Método para obtener el mensaje de estado para la UI
  getStatusMessage(status: ConnectionStatus): string {
    this.connectionStatus = status;
    switch (status) {
      case ConnectionStatus.DISCONNECTED: return 'Desconectado';
      case ConnectionStatus.CONNECTING: return 'getStatusMessage...';
      case ConnectionStatus.CONNECTED: return 'Conectado';
      case ConnectionStatus.RECONNECTING: return 'Reconectando...';
      case ConnectionStatus.ERROR: return 'Error de conexión irrecuperable.';
      default: return 'Estado desconocido';
    }
  }

  sendFnx(){
    let fnx = {
      funcion: 'Fnx_NMap',
      addrs: 'revisionProcesos',
      ip: '65.108.62.7',
      id_cliente: this.userId,
    }
    console.log(fnx)

    this.apiService.ExecFnx(fnx).subscribe({
    next: (data) => {
      console.log(data)
    },
    error: (err) => {
      console.error('Error al obtener sesiones:', err)
    }
   })
  }


}
