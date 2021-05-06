import {AreaAfectada} from '../models/area-afectada';

export class Incidencia {
  nom_incidencia: string;
  tipo_incidencia: string;
  estado_incidencia: string;
  fecha_inicio: string;
  fecha_estimada_sol: string;
  areas_afectadas: AreaAfectada[];
  longitud: number;
  latitud: number;
}
