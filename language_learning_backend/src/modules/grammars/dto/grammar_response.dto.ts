import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { GrammarStatus } from '../../../generated/prisma/enums';

class GrammarLanguageDto {
  @ApiProperty({
    example: 'cm123language',
  })
  id!: string;

  @ApiProperty({
    example: 'Tiếng Hàn',
  })
  name!: string;

  @ApiProperty({
    example: 'ko',
  })
  code!: string;
}

class GrammarLevelDto {
  @ApiProperty({
    example: 'cm123level',
  })
  id!: string;

  @ApiProperty({
    example: 'Sơ cấp 1',
  })
  name!: string;

  @ApiProperty({
    example: 1,
  })
  order!: number;

  @ApiProperty({
    type: GrammarLanguageDto,
  })
  language!: GrammarLanguageDto;
}

class GrammarTopicDto {
  @ApiProperty({
    example: 'cm123topic',
  })
  id!: string;

  @ApiProperty({
    example: 'Giới thiệu bản thân',
  })
  name!: string;

  @ApiProperty({
    type: GrammarLevelDto,
  })
  level!: GrammarLevelDto;
}

class GrammarLessonDto {
  @ApiProperty({
    example: 'cm123lesson',
  })
  id!: string;

  @ApiProperty({
    example: 'Bài 1: 저는 학생이에요',
  })
  title!: string;

  @ApiProperty({
    type: GrammarTopicDto,
  })
  topic!: GrammarTopicDto;
}

export class GrammarResponseDto {
  @ApiProperty({
    example: 'cm123grammar',
  })
  id!: string;

  @ApiProperty({
    example: 'Đuôi câu 이에요/예요',
  })
  title!: string;

  @ApiProperty({
    example: 'N + 이에요/예요',
  })
  pattern!: string;

  @ApiProperty({
    example:
      'Dùng để diễn đạt “là...”. 이에요 dùng sau danh từ có phụ âm cuối, 예요 dùng sau danh từ không có phụ âm cuối.',
  })
  explanation!: string;

  @ApiProperty({
    example: '저는 학생이에요.',
    nullable: true,
  })
  example!: string | null;

  @ApiProperty({
    example: 'Tôi là học sinh.',
    nullable: true,
  })
  exampleMeaning!: string | null;

  @ApiProperty({
    example: '학생 có phụ âm cuối nên sử dụng 이에요.',
    nullable: true,
  })
  note!: string | null;

  @ApiProperty({
    example: 1,
  })
  order!: number;

  @ApiProperty({
    enum: GrammarStatus,
    example: GrammarStatus.ACTIVE,
  })
  status!: GrammarStatus;

  @ApiProperty({
    example: 'cm123lesson',
  })
  lessonId!: string;

  @ApiPropertyOptional({
    type: GrammarLessonDto,
  })
  lesson?: GrammarLessonDto;

  @ApiProperty({
    example: '2026-08-11T10:00:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-08-11T10:00:00.000Z',
    format: 'date-time',
  })
  updatedAt!: Date;
}
