import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService, IAPICore } from 'src/app/services/apicore/api.service';
import { UtilService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-gralconsultas',
  templateUrl: './gralconsultas.component.html',
  styleUrls: ['./gralconsultas.component.scss']
})

export class GralconsultasComponent implements OnInit {

  selected = new FormControl(0);
  componente = '%'
  situacion = 'ACT'
  promocion = '%'
  especialidad = '%'
  estudios = '%'
  grado = '%'
  clasificacion = '%'
  categoria = '%'

  Componentes = []
  Grados = []
  Categorias = []
  Clasificaciones = []

  lstGenerales = []
  lstPromocion = []
  lstEspecialidad = []
  lstEstudios = []

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: ''
  }

  constructor(private apiService: ApiService,
    private ngxService: NgxUiLoaderService,
    public formatter: NgbDateParserFormatter,
    public utils: UtilService) { }

  async ngOnInit() {
    this.Componentes =
      sessionStorage.getItem("MPPD_CComponente") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CComponente")))
        : [];
    this.Componentes =
      sessionStorage.getItem('MPPD_CComponente') != undefined
        ? JSON.parse(atob(sessionStorage.getItem('MPPD_CComponente')))
        : []

    this.Grados =
      sessionStorage.getItem("MPPD_CGrado") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CGrado"))).slice(0, 8)
        : [];
    this.Categorias =
      sessionStorage.getItem("MPPD_CCategorias") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CCategorias")))
        : [];
    this.Clasificaciones =
      sessionStorage.getItem("MPPD_CClasificacion") != undefined
        ? JSON.parse(atob(sessionStorage.getItem("MPPD_CClasificacion")))
        : [];

    await this.consultarPromociones()
  }

  consultarPromociones() {
    this.xAPI.funcion = 'MPPD_CPromociones'
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        this.lstPromocion = data.Cuerpo
      },
      error => { }

    )
  }

  consultarEspecialidades() {
    let cmp = this.componente.split('|')[0]
    this.lstEspecialidad = []
    this.xAPI.funcion = 'MPPD_CEspecialidad'
    this.xAPI.parametros = cmp
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        this.lstEspecialidad = data.Cuerpo
      },
      error => { }

    )
  }

  consultarEstudios() {
    let cmp = this.componente.split('|')[0]
    this.lstEspecialidad = []
    this.xAPI.funcion = 'MPPD_CEstudios'
    this.xAPI.parametros = cmp
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        console.log(data)
        this.lstEstudios = data.Cuerpo
      },
      error => { }

    )
  }

  consultarListado() {
    let cmp = this.componente.split('|')[0]
    let sit = this.situacion
    let pro = this.promocion
    let esp = this.especialidad
    let est = this.estudios
    let cat = this.categoria


    let valorsql = this.grado == '%' ? `DB.cod_grado <=8` : ` DB.cod_grado =${this.grado}`
    this.xAPI.funcion = 'MPPD_CLibroGenerales'
    this.xAPI.parametros = cmp + ',' + sit + ',' + pro + ',' + esp + ',' + est + ',' + valorsql + ',' + cat
    this.xAPI.valores = ''

    this.lstGenerales = []
    this.ngxService.startLoader('loader-gennerales')

    console.log(this.xAPI)
    this.apiService.Ejecutar(this.xAPI).subscribe(
      data => {
        console.log(data)
        this.lstGenerales = data.Cuerpo.length > 0 ? data.Cuerpo : []
        this.ngxService.stopLoader('loader-gennerales')

      },
      (error) => {
        console.error('Error de conexion a los datos ', error)
      }
    )
  }

   /**
    * Filtra y formatea la información de nombramiento de un empleado
    * @param e - Objeto que contiene la información del empleado
    * @returns string - Texto formateado con la información del nombramiento
    */
   filtrarNombramiento(e: any): string {
       try {
           // 1. Validar entrada
           if (!e || typeof e !== 'object') {
               console.warn('Objeto de entrada inválido:', e);
               return 'SIN NOMBRAMIENTO';
           }

           // 2. Obtener cargo con manejo seguro
           const cargo = e.cargo || '';

           // 3. Validar y parsear resoluciones
           let resoluciones = [];
           try {
               if (e.resoluciones && typeof e.resoluciones === 'string') {
                   const parsed = JSON.parse(e.resoluciones);
                   resoluciones = Array.isArray(parsed) ? parsed : [];
               }
           } catch (error) {
               console.error('Error al parsear resoluciones:', error);
               return 'SIN NOMBRAMIENTO';
           }

           // 4. Filtrar y ordenar con validaciones
           const nombramientos = (Array.isArray(resoluciones) ? resoluciones : [])
               .filter(res => {
                   try {
                       return res && 
                           typeof res === 'object' && 
                           'tipo' in res && 
                           res.tipo !== 13;
                   } catch (error) {
                       console.warn('Elemento de resolución inválido:', res, error);
                       return false;
                   }
               })
               .sort((a, b) => {
                   if (!a || !b) return 0;
                   const fechaA = a.fecha || '';
                   const fechaB = b.fecha || '';
                   return fechaB.localeCompare(fechaA); // Orden descendente
               });

           // 5. Validar si hay resultados
           if (!nombramientos.length || !nombramientos[0]) {
               return 'SIN NOMBRAMIENTO';
           }

           const primerNmb = nombramientos[0];
           const asunto = primerNmb.asunto || '';
           const numero = primerNmb.numero || '';
           const fecha = primerNmb.fecha || '';

           // 6. Retornar resultado formateado
           return asunto 
               ? `${asunto}<br>RESOL. ${numero}<br>${fecha}${cargo ? '<br>' + cargo : ''}`
               : '';

       } catch (error) {
           console.error('Error inesperado en filtrarNombramiento:', error);
           return 'SIN NOMBRAMIENTO';
       }
   }

filtrarAscenso(e) {

  console.log(e)
    // 1. Validar que el objeto de entrada 'e' no sea nulo
    if (!e) {
        return 'SIN RESUELTO';
    }

    let area = this.getMerito(e.merito);

    // 2. Obtener las resoluciones o un array vacío si el valor es nulo o inválido
    const resoluciones = e.resoluciones ? JSON.parse(e.resoluciones) : [];

    // 3. Usar el array 'resoluciones' para filtrar, validando cada elemento
    let asc = resoluciones.filter(res => {
        // Asegurarse de que el elemento no es null antes de leer 'tipo'
        return res && res.tipo == 13;
    }).sort((a, b) => {
        if (a.fecha > b.fecha) {
            return -1;
        } else if (a.fecha < b.fecha) {
            return 1;
        } else {
            return 0;
        }
    });

    let texto = '';
    if (asc.length !== 0) {
        texto = `RESOL. ${asc[0].numero} <br> ${asc[0].fecha}<br><br> ${area}`;
    } else {
        texto = 'SIN RESUELTO';
    }
    return texto;
}

    setDefaultPic(event: any) {
        event.target.src = this.utils.imgNoDisponible;
    }

    getEscudo(comp): string {
        return comp == '%' ? 'mppd.png' : comp + '.jpeg'
    }

    getMerito(merito): string {
        return merito == '' || merito == undefined ? '': merito.replace('/', ' DE ') 
    }


}
