import { Module } from '@nestjs/common';
import { AdminFavoritesController } from './controllers/admin_favorites.controller';
import { FavoritesController } from './controllers/favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  controllers: [FavoritesController, AdminFavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
