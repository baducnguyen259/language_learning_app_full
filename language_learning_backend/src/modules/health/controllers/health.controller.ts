import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthService } from '../health.service';
import { HealthResponseDto } from '../dto/health_response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('live')
  @ApiOperation({
    summary: 'Kiểm tra backend có đang hoạt động',
  })
  @ApiOkResponse({
    type: HealthResponseDto,
  })
  getLiveStatus(): HealthResponseDto {
    return this.healthService.getLiveStatus();
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Kiểm tra backend và database',
  })
  @ApiOkResponse({
    type: HealthResponseDto,
  })
  @ApiServiceUnavailableResponse({
    description: 'Không thể kết nối đến database',
  })
  checkReadiness(): Promise<HealthResponseDto> {
    return this.healthService.checkDatabase();
  }
}
