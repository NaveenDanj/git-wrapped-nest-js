import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { WrappedService } from './wrapped.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithJwtUser } from '../auth/auth.controller';

@Controller('wrapped')
export class WrappedController {
  constructor(private readonly wrappedService: WrappedService) { }

  @Post('generate')
  @UseGuards(AuthGuard('jwt'))
  generateWrapped(@Req() req: RequestWithJwtUser) {
    return this.wrappedService.generateWrapped(req.user.username, req.user.accessToken);
  }

  @Get('user-wrapped')
  @UseGuards(AuthGuard('jwt'))
  async getUserWrapped(@Req() req: RequestWithJwtUser) {
    return this.wrappedService.findAllUserWrapped(req.user.id);
  }

  @Get('get-status/:id')
  @UseGuards(AuthGuard('jwt'))
  async getWrappedStatus(@Req() req: RequestWithJwtUser, @Param('id') id: string) {
    return this.wrappedService.getWrappedJobStatus(req.user.id, id);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteWrapped(@Req() req: RequestWithJwtUser, @Param('id') id: string) {
    return this.wrappedService.remove(id, req.user.id);
  }

}
