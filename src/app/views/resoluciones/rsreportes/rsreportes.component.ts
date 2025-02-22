import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-rsreportes',
  templateUrl: './rsreportes.component.html',
  styleUrls: ['./rsreportes.component.scss']
})
export class RsreportesComponent implements OnInit {

  formularioAGenerar: number = 0
  titulo: string = 'Reportes'
  bmenu = true

 


  constructor(private utilService : UtilService
  ) { }

  ngOnInit(): void {
    this.utilService.onChange$.subscribe( e => {
      console.log(e)
      this.bmenu = e
    })
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
  
      this.formularioAGenerar = n;
      this.bmenu = false
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
  }

  volver(){
    this.bmenu = true
  }
}
