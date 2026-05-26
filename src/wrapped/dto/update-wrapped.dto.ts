import { PartialType } from '@nestjs/mapped-types';
import { CreateWrappedDto } from './create-wrapped.dto';

export class UpdateWrappedDto extends PartialType(CreateWrappedDto) {}
