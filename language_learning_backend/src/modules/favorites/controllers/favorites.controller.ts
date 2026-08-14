import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  ApiNotFoundErrorResponse,
  ApiOkEnvelope,
  ApiPaginatedEnvelope,
} from '../../../common/decorators/api_response.decorator';
import { CurrentUser } from '../../../common/decorators/current_user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ApiErrorResponseDto } from '../../../common/dto/api_response.dto';
import { UserRole } from '../../../common/enums/user_role.enum';
import { JwtAuthGuard } from '../../../common/guards/jwt_auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import type { AuthenticatedUser } from '../../auth/interfaces/jwt_payload.interface';
import { FavoriteQueryDto } from '../dto/favorite_query.dto';
import {
  VocabularyFavoriteResponseDto,
  VocabularyFavoriteStatusResponseDto,
} from '../dto/favorite_response.dto';
import { FavoritesService } from '../favorites.service';

@ApiTags('Favorites')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({
  description: 'Thiếu access token hoặc token không hợp lệ',
  type: ApiErrorResponseDto,
})
@ApiForbiddenResponse({
  description: 'Tài khoản không có quyền người học',
  type: ApiErrorResponseDto,
})
@Controller('favorites')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.USER)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('vocabularies')
  @ApiOperation({ summary: 'Lấy danh sách từ vựng yêu thích' })
  @ApiPaginatedEnvelope(VocabularyFavoriteResponseDto)
  findVocabularyFavorites(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: FavoriteQueryDto,
  ) {
    return this.favoritesService.findVocabularyFavorites(user.id, query);
  }

  @Post('vocabularies/:vocabularyId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Thêm từ vựng vào danh sách yêu thích' })
  @ApiOkEnvelope(VocabularyFavoriteResponseDto)
  @ApiNotFoundErrorResponse()
  addVocabularyFavorite(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vocabularyId') vocabularyId: string,
  ) {
    return this.favoritesService.addVocabularyFavorite(user.id, vocabularyId);
  }

  @Delete('vocabularies/:vocabularyId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bỏ từ vựng khỏi danh sách yêu thích' })
  @ApiOkEnvelope(VocabularyFavoriteStatusResponseDto)
  removeVocabularyFavorite(
    @CurrentUser() user: AuthenticatedUser,
    @Param('vocabularyId') vocabularyId: string,
  ) {
    return this.favoritesService.removeVocabularyFavorite(
      user.id,
      vocabularyId,
    );
  }
}
