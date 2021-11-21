import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PatchCustomerDto } from './dto/patch-customer.dto';

@Injectable()
export class PatchValidationPipe implements PipeTransform {
  transform(value: PatchCustomerDto): PatchCustomerDto {
    const patchCustomerDto = plainToClass(PatchCustomerDto, value, {
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
