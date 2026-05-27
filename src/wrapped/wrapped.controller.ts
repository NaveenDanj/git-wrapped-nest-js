import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { WrappedService } from './wrapped.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithJwtUser } from '../auth/auth.controller';

@Controller('wrapped')
export class WrappedController {
  constructor(private readonly wrappedService: WrappedService) { }

  @Post('generate')
  @UseGuards(AuthGuard('jwt'))
  generateWrapped(@Req() req: RequestWithJwtUser) {
    console.log("Generating wrapped for user:", req.user.username);
    console.log("Access token:", req.user.accessToken);
    return this.wrappedService.generateWrapped(req.user.username, req.user.accessToken);
  }

}
