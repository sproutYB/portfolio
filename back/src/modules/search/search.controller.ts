import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { searchDTO } from './dto/search.dto';
import { SearchService } from './search.service';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  /**
   * 검색기능
   */
  @Get()
  async search(@Query() searchDto: searchDTO): Promise<object> {
    const searchData = await this.searchService.search(
      searchDto.option,
      searchDto.keyword,
    );
    return searchData;
  }
}
