import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import RegisterDto from './dto/register.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TokenPayload from './token.payload';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  public async register(registrationData: RegisterDto) {
    try {
      const user = await this.userRepository.save({
        ...registrationData,
        fio: registrationData.fio,
        login: registrationData.login,
        password: registrationData.password,
        apiToken: this.getCookieWithJwtToken(registrationData.login),
      });

      return { fio: user.fio, token: user.apiToken };
    } catch (error) {
      if (error?.code === 'PostgresErrorCode.UniqueViolation') {
        throw new HttpException(
          'User with that login already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async login(authDto: RegisterDto) {
    try {
      const login = authDto.login;
      const user = await this.userRepository.findOne({ where: { login } });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }

      await this.verifyPassword(authDto.password, user.password);

      return { fio: user.fio, token: user.apiToken };
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookieWithJwtToken(login: string) {
    const payload: TokenPayload = { login };

    return this.jwtService.sign(payload, { secret: `secret` });
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  private async verifyPassword(authPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(
      authPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
