import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Tags')
@ApiBearerAuth()
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOkResponse({ description: 'Tag created successfully' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Jwt auth shloud be provided' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  createTag(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.insertOne(createTagDto);
  }

  @ApiOkResponse({ description: 'Tags retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Jwt auth shloud be provided' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  @Get()
  findAll() {
    return this.tagsService.getAll();
  }

  @ApiNoContentResponse({ description: 'Tag removed successfully' })
  @ApiUnauthorizedResponse({ description: 'Jwt auth shloud be provided' })
  @ApiBadRequestResponse({ description: 'Id provied not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':tagId')
  deleteTag(@Param('tagId', ParseIntPipe) tagId: number) {
    return this.tagsService.removeOne(tagId);
  }
}
