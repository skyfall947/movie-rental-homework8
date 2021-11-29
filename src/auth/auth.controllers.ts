import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Credentials are invalid' })
  @ApiOkResponse({ description: 'Auth token retrieved successfully' })
  @ApiBody({ schema: LoginUserDto, description: 'Enter user credentials' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() request) {
    return this.authService.login(request.user);
  }

  @ApiExcludeEndpoint()
  @Post('logout')
  logout() {
    return 'Please destroy the token on the client-side';
  }
}
