import { Pipe, PipeTransform } from '@angular/core';
import { Dinosaur } from '../dinos/I-Dino';

@Pipe({
  name: 'filterDinos'
})
export class FilterDinosPipe implements PipeTransform {

  transform(dinos: Dinosaur[], filterBy: string): Dinosaur[] {
      // el primer argument és el que cal filtrar i després una llista d'arguments
      // en aquest cas sols és un, el criteri de búsqueda
      const filter = filterBy?.toLowerCase() || ''; // passem el filtre a minúscules o a null si no està
      
      return filter // Si no és null filtra
        ? dinos.filter((dino) => dino.name?.toLowerCase().includes(filter))
        : dinos; // si és null trau l'array sense filtre
    }

}