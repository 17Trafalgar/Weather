import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ nullable: false })
  @IsString()
  @IsNotEmpty()
  fio: string;

  @ApiProperty({ nullable: false })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ nullable: false })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export default RegisterDto;
