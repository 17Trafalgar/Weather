import { WeatherEntity } from 'src/weather/weather.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(`user`)
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  fio: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  apiToken: string;

  @OneToMany(() => WeatherEntity, (weather) => weather.user, {
    cascade: true,
  })
  weather: WeatherEntity[];
}
