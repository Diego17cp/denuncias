import "jspdf";

declare module "jspdf" {
	interface jsPDF {
		lastAutoTable: {
			finalY: number;
		};
	}
}
export interface Denunciante {
	nombres: string;
	email: string;
	telefono: string;
	tipo_documento: string;
	numero_documento: string;
	sexo: string;
}

export interface Denunciado {
	nombre: string;
	tipo_documento: string;
	numero_documento: string;
	representante_legal: string;
	razon_social: string;
	cargo: string;
}

export interface Adjunto {
	file: File;
	name: string;
}

export interface FormData {
	es_anonimo: boolean;
	denunciante: Denunciante | null;
	denunciado: Denunciado;
	motivo_id: string;
	motivo_otro: string;
	descripcion: string;
	fecha_incidente: string | null;
	adjuntos: Adjunto[];
	tracking_code?: string;
}

export interface Motivo {
	id: string;
	nombre: string;
	descripcion: string;
}

interface Tracking {
	estado: string;
	fecha_actualizacion: string;
	comentario: string;
}

export interface TrackingData {
	success: boolean
	data?: Tracking[]
}

export interface DenunciaRecibida {
	tracking_code: string;
	estado: string;
	fecha_registro: string;
	denunciante_nombre: string;
	denunciante_dni: string;
	denunciado_nombre: string;
	denunciado_dni: string;
	motivo: string;
	descripcion: string;
	fecha_incidente: string;
	seguimiento_comentario: string;
	motivo_otro:string
}
export interface Administrador {
    dni_admin: string;
    nombres: string;
    categoria: 'admin' | 'super_admin';
    estado: 'activo' | 'inactivo';
}
export type Action = "password" | "state" | "role";
