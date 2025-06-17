import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum TypingIndicators {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

export enum ReadReceipts {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

export class PrivacySettingsDto {
  @IsEnum(TypingIndicators)
  typing_indicators: TypingIndicators;

  @IsEnum(ReadReceipts)
  read_receipts: ReadReceipts;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  image: string;

  @ValidateNested()
  @Type(() => PrivacySettingsDto)
  @IsOptional()
  privacySettings?: PrivacySettingsDto;
}
