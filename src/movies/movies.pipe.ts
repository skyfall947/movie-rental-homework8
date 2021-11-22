import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PatchMovieDto } from './dto/patch-movie.dto';

@Injectable()
export class PatchValidationPipe implements PipeTransform {
  transform(value: PatchMovieDto): PatchMovieDto {
    const patchCustomerDto = plainToClass(PatchMovieDto, value, {
      excludeExtraneousValues: true,
    });
    const propValues = Object.values(patchCustomerDto);
    const areAllUndefined = propValues.every((prop) => prop === undefined);
    if (areAllUndefined)
      throw new BadRequestException(
        'At least a valid property should be given to update',
      );
    return value;
  }
}
