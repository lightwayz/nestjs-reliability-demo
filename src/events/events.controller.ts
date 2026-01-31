import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateEventDto } from '../auth/dto/create-event.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  @Get('health')
  health() {
    return { ok: true, module: 'events' };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Create an event (organizer/admin only)' })
  create(@Body() dto: CreateEventDto) {
    return { ok: true, created: dto };
  }
}
