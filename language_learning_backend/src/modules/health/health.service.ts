import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { HealthResponseDto } from './dto/health_response.dto';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  getLiveStatus(): HealthResponseDto {
    return {
      status: 'up',
      service: 'api',
      timestamp: new Date().toISOString(),
    };
  }

  async checkDatabase(): Promise<HealthResponseDto> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'up',
        service: 'database',
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new ServiceUnavailableException('Không thể kết nối đến database');
    }
  }
}
