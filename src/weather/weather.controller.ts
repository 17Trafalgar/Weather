import { Body, Controller, Post } from '@nestjs/common';
import { WeatherService } from './weather.service';
import WeatherDto from './dto/weather.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Weather (weather)')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post()
  async register(@Body() dto: WeatherDto) {
    return this.weatherService.getWeather(dto);
  }
}
