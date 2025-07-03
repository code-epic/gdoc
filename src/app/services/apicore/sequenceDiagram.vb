sequenceDiagram
    participant MP as Mesa de Partes
    participant CG as Control de Gestión
    participant SEC as Secretaría
    participant RES as Resoluciones
    participant TIM as Timonel
    participant S_OUT as Salida (Control de Gestión)
    participant PUBLISH as Áreas Destino (Publicación)

    Note over MP,PUBLISH: Flujo de Gestión de Punto de Cuenta en Régimen Regular

    MP->>MP: Recepción Física del Documento
    MP->>CG: Notificar Documento Recibido y Registrado vía Sistema de Gestión Documental (SGD)
    activate CG
    CG->>CG: Carga de Expediente Digital (PDF)
    CG->>CG: Clasificación Preliminar
    CG->>SEC: Enrutar Expediente Digital vía SGD (Buzón Digital)
    deactivate CG

    activate SEC
    SEC->>SEC: Recepción y Análisis de Expediente
    SEC->>SEC: Clasificación Detallada y Asignación
    alt Aprobación Provisional
        SEC->>RES: Transferir Expediente (Aprobado Prov.) vía SGD (Buzón Digital)
    else Rechazo Temprano
        SEC->>MP: Notificar Cierre por Rechazo vía Correo Electrónico / SGD
        SEC->>SEC: Registrar Cierre por Rechazo
    else Puesta en Espera de Opinión
        SEC->>SEC: Poner Expediente en Espera
        loop Espera de Opinión / Reevaluación
            Note over SEC: Monitorear por Opinión Externa
            SEC->>SEC: Evaluar Opinión Recibida
            alt Si Opinión es Favorable
                SEC->>RES: Transferir Expediente (Con Opinión Aprobatoria) vía SGD (Buzón Digital)
            else Si Proceso Cancelado / Sin Opinión
                SEC->>MP: Notificar Cierre por Cancelación vía Correo Electrónico / SGD
                SEC->>SEC: Registrar Cierre por Cancelación
            end
        end
    end
    deactivate SEC

    activate RES
    RES->>RES: Recepción y Procesamiento Expediente
    RES->>RES: Clasificación y Organización
    RES->>RES: Selección de Plantilla
    RES->>RES: Preparación y Transcripción
    RES->>RES: Revisión Analítica
    RES->>TIM: Enrutar Resolución para Firma vía Expediente Físico / SGD
    deactivate RES

    activate TIM
    TIM->>TIM: Custodia y Gestión de Resolución
    TIM->>TIM: Validación y Firma
    alt Firmada (Aprobada)
        TIM->>RES: Retornar Resolución Firmada vía Expediente Físico / SGD
    else Rechazada / Otra Decisión
        TIM->>RES: Retornar Resolución con Decisión vía Expediente Físico / SGD
    end
    deactivate TIM

    activate RES
    RES->>RES: Procesamiento de Resolución Firmada
    RES->>SEC: Notificar Estatus Final vía SGD / Correo Electrónico
    RES->>CG: Notificar Estatus Final vía SGD / Correo Electrónico
    RES->>S_OUT: Transferir Documento para Notificación de Salida vía SGD
    deactivate RES

    activate S_OUT
    S_OUT->>PUBLISH: Publicar y Diseminar Resolución vía Correo / Intranet / SGD
    deactivate S_OUT
    PUBLISH-->>MP: Confirmación de Publicación vía Correo Electrónico






    graph TD
    %% Definición de Nodos (Roles)
    A[Mesa de Partes]
    B[Control de Gestión]
    C[Secretaría]
    D[Resoluciones]
    E[Timonel]
    F[Áreas Destino Publicación]

    %% Definición de Flujos/Interacciones Clave
    A -- Documento Recibido / Registrado --> B
    B -- Expediente Digital Enrutado --> C
    C -- Expediente Evaluado(Aprobado/Rechazado/Espera) --> D
    C -- Notificación de Cierre --> A
    D -- Resolución para Firma --> E
    E -- Resolución Firmada / Decidida --> D
    D -- Estatus Final / Publicación --> B
    B -- Resolución Publicada --> F
    F -- Confirmación de Publicación --> A

    %% Estilos (Opcional, para mejorar la visualización)
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#ffb,stroke:#333,stroke-width:2px
    style E fill:#fbc,stroke:#333,stroke-width:2px
    style F fill:#cff,stroke:#333,stroke-width:2px