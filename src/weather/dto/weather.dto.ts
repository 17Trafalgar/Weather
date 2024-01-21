import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class WeatherDto {
  @ApiProperty({ nullable: false })
  @IsString()
  @IsNotEmpty()
  apiToken: string;
}

export default WeatherDto;
