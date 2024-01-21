import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WeatherEntity } from './weather.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/auth/user.entity';
import WeatherDto from './dto/weather.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(WeatherEntity)
    private readonly weatherRepository: Repository<WeatherEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {}

  async getWeather(dto: WeatherDto) {
    const apiToken = dto.apiToken;
    const user = await this.userRepository.findOne({ where: { apiToken } });

    if (!user) {
      throw new NotFoundException('Invalid token');
    }

    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${this.configService.get('KEY')}&q=London&aqi=no`,
    );

    const data = await response.json();

    const dataForBd = this.weatherRepository.create({
      user,
      action_time: Math.floor(Date.now() / 1000),
      request_result: data,
      temp_c: data.current.temp_c,
    });

    if (!dataForBd.request_result) {
      throw new NotFoundException('Invalid response');
    }

    return this.weatherRepository.save(dataForBd);
  }
}
