import { IsString, IsNotEmpty } from 'class-validator';

export class WeatherDto {
  @IsString()
  @IsNotEmpty()
  apiToken: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  language: string;
}

export default WeatherDto;
