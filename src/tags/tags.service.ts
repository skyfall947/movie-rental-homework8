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
}
