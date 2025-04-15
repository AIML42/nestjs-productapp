import { Controller, Post, Body, HttpCode, HttpStatus, ValidationPipe, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';   
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth') 
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    @HttpCode(HttpStatus.OK) 
    async signup(@Body() signupDto: SignupDto) {

        return this.authService.initiateSignup(signupDto);
    }


    @Post('login')
    @HttpCode(HttpStatus.OK)
  
    async login(@Body() loginDto: LoginDto) {
       
        return this.authService.initiateLogin(loginDto);
    }

   
    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
 
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
       
        return this.authService.verifyOtp(
            verifyOtpDto.phone_number,
            verifyOtpDto.otp,
        );
    }
}