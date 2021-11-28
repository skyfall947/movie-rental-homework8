import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async insertOne(createTagDto: CreateTagDto) {
    try {
      const tag = this.tagRepository.create(createTagDto);
      return await tag.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll() {
    return this.tagRepository.find();
  }

  async findOne(tagId: number) {
    try {
      return this.tagRepository.findOneOrFail(tagId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removeOne(tagId: number) {
    try {
      const tag = await this.tagRepository.findOneOrFail(tagId);
      const moviesTaggedWithThisTag = await this.tagRepository
        .createQueryBuilder('tag')
        .innerJoinAndSelect(
          'movie_tags_tag',
          'tagged',
          'tag.tagId = tagged.tagTagId',
        )
        .where('tag.tagId = :tagId', { tagId })
        .execute();
      if (moviesTaggedWithThisTag.length !== 0) {
        throw new Error('This tag have movies related to it');
      }
      await this.tagRepository.remove(tag);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
