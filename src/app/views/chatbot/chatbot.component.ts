import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  public loading: boolean = false;
  // Aquí puedes agregar la lógica de tu chatbot
  // Propiedad para la conexión WebSocket
  private ws: WebSocket | undefined;

  // private ws: WebSocket | undefined;
  private userId: string = ''; // Aquí guardaremos el ID del usuario

  public message: string = '';
  public messages: { message: string, id: string, from: 'bot' | 'user' }[] = [];


  // Propiedad para el mensaje actual del usuario
  // public message: string = '';

  // // Array para almacenar los mensajes de la conversación
  public messagesx: { text: string, from: 'bot' | 'user' }[] = [];

  constructor() { }

  ngOnInit(): void {
    // 1. Cargar el historial de la conversación desde localStorage.
    this.loadHistory();

    this.userId = this.getUserId();
    let message = 'NOMBRE DEL USUARIO';
    // URL de tu servidor Go, incluyendo el puerto y la ruta específica
    const encodedMessage = encodeURIComponent(message); // Codifica el contenido del mensaje

    // Construye la URL del servidor, incluyendo el ID del usuario y el mensaje como parámetros de consulta
    const serverUrl = `wss://localhost:3000/sandra_ws?userId=${this.userId}&initialMessage=${encodedMessage}`;
    // const serverUrl = 'wss://localhost:3000/sandra_ws';

    // Crea una nueva instancia de WebSocket
    this.ws = new WebSocket(serverUrl);

    this.ws.onopen = () => {
      this.messages.push({ message: '¡Conectado al servidor!', id: `${this.userId}`, from: 'bot' });
      const messageObject = {
        id: this.userId,
        message: 'Evaluando conexion'
      };
      this.ws.send(JSON.stringify(messageObject));
    };

    // En tu componente de Angular
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // Intentar parsear el JSON
        // console.log(data)
        // Asumiendo que `data` es de tipo { Content: string, Done: boolean }
        if (data && typeof data.content === 'string' && typeof data.done === 'boolean') {
          const lastMessage = this.messages[this.messages.length - 1];

          // Si el último mensaje es del bot, sigue añadiendo los chunks
          if (lastMessage && lastMessage.from === 'bot' && this.loading) {
            lastMessage.message += data.content; // Añade el contenido
          } else {
            // Si es el primer chunk de una nueva respuesta, crea un nuevo mensaje
            this.messages.push({ from: 'bot', message: data.content, id: `${this.userId}` });
          }

          // Si el campo 'Done' es true, la respuesta ha terminado
          if (data.done) {
            console.log('Respuesta de Ollama terminada.');
            this.loading = false; 
            this.saveHistory(); 
          }
        } else {
          console.warn('Mensaje de WebSocket con formato inesperado o no JSON:', event.data);
          this.messages.push({ from: 'bot', message: String(event.data), id: `${this.userId}` });
          this.loading = false; 
          this.saveHistory();
        }
      } catch (e) {
        console.error('Error al parsear mensaje WebSocket:', e, 'Mensaje crudo:', event.data);
        this.messages.push({ from: 'bot', message: String(event.data), id: `${this.userId}` });
        this.loading = false; 
        this.saveHistory();
      }
    };

    // this.ws.onmessage = (event) => {
    //   const lastMessage = this.messages[this.messages.length - 1];
    //   if (lastMessage && lastMessage.from === 'bot') {
    //     lastMessage.message += event.data;
    //   } else {
    //     this.messages.push({ from: 'bot', message: event.data, id: `${this.userId}` });
    //   }
    //   this.saveHistory(); 
    // };

    this.ws.onclose = () => {
      // this.messages.push({ message: 'Conexión cerrada.', id: `${this.userId}`, from: 'bot' });
      this.saveHistory();
    };
    // // Maneja los errores de conexión
    this.ws.onerror = (error) => {
      console.error('Error del WebSocket:', error);
      this.messages.push({ message: 'Error: No se pudo conectar al servidor.', id: `${this.userId}`, from: 'bot' });
    };
  }

  // Nuevo método para obtener un ID único o recuperar uno existente.
  private getUserId(): string {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = this.uuidv4(); // Genera un ID universal único
      localStorage.setItem('userId', id);
    }
    return id;
  }

  // Generador UUID v4 compatible con navegadores
  private uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  // Método para enviar mensajes al servidor
  public sendMessage(): void {
    // console.log(this.ws)
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        // Crea un objeto JSON con el ID y el mensaje.
        const messageObject = {
          id: this.userId,
          message: this.message
        };
        console.log('Enviando mensaje:', messageObject);
        this.ws.send(JSON.stringify(messageObject));
        console.log('Enviando mensaje:', JSON.stringify(messageObject))
        this.loading = true;
        this.messages.push({ message: `Tú: ${this.message}`, id: `${this.userId}`, from: 'user' });
        this.message = '';
        // 3. Guardar el historial de la conversación en localStorage.
        this.saveHistory();
      } else {
        this.messages.push({ message: 'Error: Conexión no está abierta.', id: `${this.userId}`, from: 'bot' });
      }
    }
  }
  // public sendMessage(): void {
  //   if (this.ws && this.message.trim()) {
  //     // Envía el mensaje si la conexión está abierta
  //     if (this.ws.readyState === WebSocket.OPEN) {
  //       this.ws.send(this.message);
  //       this.messages.push({ text: this.message, from: 'user' });
  //       this.loading = true;
  //       this.message = ''; // Limpia el input
  //     } else {
  //       this.messages.push({ text: 'Error: Conexión no está abierta.', from: 'bot' });
  //     }
  //   }
  // }

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
}
