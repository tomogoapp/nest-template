import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from './entities/attribute.entity';

@Module({
  controllers: [AttributesController],
  providers: [AttributesService],
  imports:[
    TypeOrmModule.forFeature([ Attribute ])
  ],
  exports:[
    TypeOrmModule.forFeature([ Attribute ])
  ]
})
export class AttributesModule {}
