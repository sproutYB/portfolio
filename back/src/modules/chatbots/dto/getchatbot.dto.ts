import { IsString } from 'class-validator';

export class GetChatbotDto {
  /**
   * @example "경운박물관 전화번호 알려줘"
   */
  @IsString()
  text: string;
}
