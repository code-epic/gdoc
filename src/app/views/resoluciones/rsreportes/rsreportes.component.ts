import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rsreportes',
  templateUrl: './rsreportes.component.html',
  styleUrls: ['./rsreportes.component.scss']
})
export class RsreportesComponent implements OnInit {

  formularioAGenerar: number = 0
  titulo: string = 'Reportes'

  constructor(
  ) { }

  ngOnInit(): void {
  }

  /**
   * @param n
   * 0: Ninguno
   * 1: Codigos Rojos
   * 2: Bajas
   * 3: Nombramientos
   * 4: Ascensos
   */
  cambiarFormulario(n: number){
    this.formularioAGenerar = 0
    setTimeout(() => {
      this.formularioAGenerar = n;

      switch(n){
        case 1: 
          this.titulo = 'Codigos Rojos'
          break
        case 2:
          this.titulo = 'Bajas'
          break
        case 3:
          this.titulo = 'Nombramientos'
          break
        case 4:
          this.titulo = 'Ascensos'
          break
      }
    }, 10);
  }
}
