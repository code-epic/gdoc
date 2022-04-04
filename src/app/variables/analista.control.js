{
    "cedula": "18470898",
    "nombre": "TN. Fernando Fraute Bruguera",
    "login": "18470898",
    "correo": "",
    "clave": "393a9f8b0b9d1b751bffbe860fe18d19f0639cbae7bc42123f187cf7f5187322",
    "sucursal": "Todas",
    "direccion": "Despacho del Ministro",
    "cargo": "Gerente de Control de Gestion",
    "telefono": "",
    "sistema": "Control de Gestion",
    "token": "Autorizado",
    "Perfil": {
      "descripcion": "Analista Control"
    },
    "Aplicacion": [
      {
        "id": "ID-001",
        "nombre": "Gestion de Documentos",
        "url": "http://localhost/app/gdoc/index.html?tk=$0",
        "comentario": "Usuario GDoc",
        "version": "V1.0.0.0",
        "autor": "Code-Epic Technologies",
        "Rol": {
          "descripcion": "Usuario Sistema",
          "Menu": [
            {
              "url": "",
              "js": "",
              "icono": "ni-tv-2",
              "descripcion": "Principal",
              "nombre": "Principal",
              "accion": "",
              "clase": "text-primary",
              "color": "",
              "Privilegio": [
                
              ],
              "SubMenu": [
                {
                  "url": "",
                  "js": "",
                  "descripcion": "Documentos Registrados",
                  "icono": "fa fa-plus-circle",
                  "nombre": "Registrados",
                  "accion": "CargarUrl('control', 'registrar')",
                  "clase": "f-left",
                  "color": "bg-c-green",
                  "Privilegios": [
                   
                  ]
                },
                {
                    "url": "",
                    "js": "",
                    "descripcion": "Documentos Recibidos",
                    "icono": "fa fa-inbox",
                    "nombre": "Recibidos",
                    "accion": "CargarUrl('control', 'buzon')",
                    "clase": "f-left",
                    "color": "bg-c-blue",
                    "Privilegios": [
                    
                    ]
                },
                {
                    "url": "",
                    "js": "",
                    "descripcion": "Salidas Realizadas",
                    "icono": "fa fa-share",
                    "nombre": "Salidas",
                    "accion": "CargarUrl('control', 'salidas')",
                    "clase": "f-left",
                    "color": "bg-c-pink",
                    "Privilegios": [
                        {
                        "metodo": "registrados",
                        "descripcion": "Registrados",
                        "accion": "Registrados()",
                        "directivas": ""
                        },
                        {
                        "metodo": "clasificacion",
                        "descripcion": "Clasificacion",
                        "accion": "Clasificacion()",
                        "directivas": ""
                        }
                    ]
                }
              ]
            },
            {
              "url": "",
              "js": "",
              "icono": "ni-planet",
              "descripcion": "Control y Gestión",
              "nombre": "Control y Gestión",
              "accion": "",
              "clase": "text-blue",
              "color": "",
              "Privilegio": [
                
              ],
              "SubMenu": [
                {
                  "url": "",
                  "js": "",
                  "descripcion": "Documentos Registrados",
                  "icono": "fa fa-plus-circle",
                  "nombre": "Registrados",
                  "accion": "CargarUrl('control', 'registrar')",
                  "clase": "f-left",
                  "color": "bg-c-green",
                  "Privilegios": [
                    {
                      "metodo": "registrados",
                      "descripcion": "Registrados",
                      "accion": "Registrados()",
                      "directivas": ""
                    },
                    {
                      "metodo": "clasificacion",
                      "descripcion": "Clasificacion",
                      "accion": "Clasificacion()",
                      "directivas": ""
                    }
                  ]
                },
                {
                    "url": "",
                    "js": "",
                    "descripcion": "Documentos Recibidos",
                    "icono": "fa fa-inbox",
                    "nombre": "Recibidos",
                    "accion": "CargarUrl('control', 'buzon')",
                    "clase": "f-left",
                    "color": "bg-c-blue",
                    "Privilegios": [
                      {
                        "metodo": "recibidos",
                        "descripcion": "Recibidos",
                        "accion": "Recibidos()",
                        "directivas": ""
                      },
                      {
                        "metodo": "procesados",
                        "descripcion": "Procesados",
                        "accion": "Procesados()",
                        "directivas": ""
                      },
                      {
                        "metodo": "pendientes",
                        "descripcion": "Pendientes",
                        "accion": "Pendientes()",
                        "directivas": ""
                      },
                      {
                        "metodo": "cerrados",
                        "descripcion": "Cerrados",
                        "accion": "Cerrados()",
                        "directivas": ""
                      }
                    ]
                },
                {
                    "url": "",
                    "js": "",
                    "descripcion": "Salidas Realizadas",
                    "icono": "fa fa-share",
                    "nombre": "Salidas",
                    "accion": "CargarUrl('control', 'salidas')",
                    "clase": "f-left",
                    "color": "bg-c-pink",
                    "Privilegios": [
                        {
                        "metodo": "registrados",
                        "descripcion": "Registrados",
                        "accion": "Registrados()",
                        "directivas": ""
                        },
                        {
                        "metodo": "clasificacion",
                        "descripcion": "Clasificacion",
                        "accion": "Clasificacion()",
                        "directivas": ""
                        }
                    ]
                }
              ]
            },
            {
              "url": "",
              "js": "",
              "icono": "ni-pin-3",
              "descripcion": "Secretaria",
              "nombre": "Secretaria",
              "accion": "",
              "clase": "text-orange",
              "color": "",
              "Privilegio": [
                
              ],
              "SubMenu": [
                {
                  "url": "",
                  "js": "",
                  "icono": "fas fa-shipping-fast",
                  "nombre": "Oficina Postal",
                  "accion": "CargarUrl('cuerpo', 'inc/cnc/registro')",
                  "clase": "opt",
                  "color": "bg-success",
                  "Privilegios": [
                    {
                      "metodo": "actualizar",
                      "descripcion": "Actualizar",
                      "accion": "ActualizarOPT()",
                      "directivas": ""
                    },
                    {
                      "metodo": "reporte",
                      "descripcion": "Reportes",
                      "accion": "Reportes()",
                      "directivas": ""
                    }
                  ]
                }
              ]
            },
            {
              "url": "",
              "js": "",
              "icono": "ni-single-02 ",
              "descripcion": "Resoluciones",
              "nombre": "Resoluciones",
              "accion": "",
              "clase": "text-yellow",
              "color": "",
              "Privilegio": [
                
              ],
              "SubMenu": [
                {
                  "url": "",
                  "js": "",
                  "icono": "fas fa-shipping-fast",
                  "nombre": "Oficina Postal",
                  "accion": "CargarUrl('cuerpo', 'inc/cnc/registro')",
                  "clase": "opt",
                  "color": "bg-success",
                  "Privilegios": [
                    {
                      "metodo": "actualizar",
                      "descripcion": "Actualizar",
                      "accion": "ActualizarOPT()",
                      "directivas": ""
                    },
                    {
                      "metodo": "reporte",
                      "descripcion": "Reportes",
                      "accion": "Reportes()",
                      "directivas": ""
                    }
                  ]
                }
              ]
            },
            {
              "url": "",
              "js": "",
              "icono": "ni-bullet-list-67",
              "descripcion": "Ayudantia",
              "nombre": "Ayudantia",
              "accion": "",
              "clase": "text-red",
              "color": "",
              "Privilegio": [
                
              ],
              "SubMenu": [
                {
                  "url": "",
                  "js": "",
                  "icono": "fas fa-shipping-fast",
                  "nombre": "Oficina Postal",
                  "accion": "CargarUrl('cuerpo', 'inc/cnc/registro')",
                  "clase": "opt",
                  "color": "bg-success",
                  "Privilegios": [
                    {
                      "metodo": "actualizar",
                      "descripcion": "Actualizar",
                      "accion": "ActualizarOPT()",
                      "directivas": ""
                    },
                    {
                      "metodo": "reporte",
                      "descripcion": "Reportes",
                      "accion": "Reportes()",
                      "directivas": ""
                    }
                  ]
                }
              ]
            },
            {
              "url": "",
              "js": "",
              "icono": "ni-circle-08 ",
              "descripcion": "Acami",
              "nombre": "Acami",
              "accion": "",
              "clase": "text-pink",
              "color": "",
              "Privilegio": [
                
              ],
              "SubMenu": [
                {
                  "url": "",
                  "js": "",
                  "icono": "fas fa-shipping-fast",
                  "nombre": "Oficina Postal",
                  "accion": "CargarUrl('cuerpo', 'inc/cnc/registro')",
                  "clase": "opt",
                  "color": "bg-success",
                  "Privilegios": [
                    {
                      "metodo": "actualizar",
                      "descripcion": "Actualizar",
                      "accion": "ActualizarOPT()",
                      "directivas": ""
                    },
                    {
                      "metodo": "reporte",
                      "descripcion": "Reportes",
                      "accion": "Reportes()",
                      "directivas": ""
                    }
                  ]
                }
              ]
            },
            {
              "url": "",
              "js": "",
              "icono": "ni-key-25",
              "descripcion": "Timonel",
              "nombre": "Timonel",
              "accion": "",
              "clase": "text-info",
              "color": "",
              "Privilegio": [
                
              ],
              "SubMenu": [
                {
                  "url": "",
                  "js": "",
                  "icono": "fas fa-shipping-fast",
                  "nombre": "Oficina Postal",
                  "accion": "CargarUrl('cuerpo', 'inc/cnc/registro')",
                  "clase": "opt",
                  "color": "bg-success",
                  "Privilegios": [
                    {
                      "metodo": "actualizar",
                      "descripcion": "Actualizar",
                      "accion": "ActualizarOPT()",
                      "directivas": ""
                    },
                    {
                      "metodo": "reporte",
                      "descripcion": "Reportes",
                      "accion": "Reportes()",
                      "directivas": ""
                    }
                  ]
                }
              ]
            },
            {
              "url": "",
              "js": "",
              "icono": "ni-bullet-list-67",
              "descripcion": "Personal",
              "nombre": "Personal",
              "accion": "",
              "clase": "text-red",
              "color": "",
              "Privilegio": [
                
              ],
              "SubMenu": [
                {
                  "url": "",
                  "js": "",
                  "icono": "fas fa-shipping-fast",
                  "nombre": "Oficina Postal",
                  "accion": "CargarUrl('cuerpo', 'inc/cnc/registro')",
                  "clase": "opt",
                  "color": "bg-success",
                  "Privilegios": [
                    {
                      "metodo": "actualizar",
                      "descripcion": "Actualizar",
                      "accion": "ActualizarOPT()",
                      "directivas": ""
                    },
                    {
                      "metodo": "reporte",
                      "descripcion": "Reportes",
                      "accion": "Reportes()",
                      "directivas": ""
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    ],
    "firmadigital": {
      "direccionmac": "*",
      "direccionip": "*",
      "tiempo": "2022-04-03T19:07:05.851Z"
    }
  }