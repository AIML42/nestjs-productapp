// src/auth/auth.service.ts
import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; 
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schemas'; 
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(

    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private generateOtp(): string {
    return '1234';
  }


  async initiateSignup(signupDto: SignupDto): Promise<{ message: string }> {
    const { phone_number, first_name, last_name } = signupDto;

    const existingUser = await this.userModel.findOne({ phone_number }).exec();
    if (existingUser) {
      throw new ConflictException(`User with phone number ${phone_number} already exists.`);
    }

    const otp = this.generateOtp();

    try {

      const newUser = new this.userModel({
        phone_number,
        first_name,
        last_name,
        otp: otp,
      });
      await newUser.save(); 
      this.logger.log(`New user created: ${phone_number}. OTP: ${otp}`);
 
      return { message: `User created. OTP sent to ${phone_number}.` };
    } catch (error) {
      this.logger.error(`Failed to create user ${phone_number}: ${error.message}`, error.stack);
      if (error.code === 11000) {
        throw new ConflictException(`User with phone number ${phone_number} already exists.`);
      }
      throw new InternalServerErrorException('Failed to create user.');
    }
  }


  async initiateLogin(loginDto: LoginDto): Promise<{ message: string }> {
    const { phone_number } = loginDto;


    const user = await this.userModel.findOne({ phone_number }).exec();
    if (!user) {
      throw new NotFoundException(`User with phone number ${phone_number} not found.`);
    }
    if (!user.is_active) {
      throw new NotFoundException(`User account ${phone_number} is inactive.`);
    }

    const otp = this.generateOtp();

    try {
     
      await this.userModel.updateOne({ _id: user._id }, { $set: { otp: otp } });
      this.logger.log(`Login initiated for user: ${phone_number}. OTP: ${otp}`);
   
      return { message: `OTP sent to ${phone_number} for login.` };
    } catch (error) {
        this.logger.error(`Failed to update OTP for user ${phone_number}: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Failed to initiate login.');
    }
  }


  async verifyOtp(phoneNumber: string, otp: string): Promise<{ message: string; user: Omit<UserDocument, 'otp'>; token: string }> {
    this.logger.log(`Verifying OTP for ${phoneNumber} with OTP: ${otp}`);


    const user: UserDocument | null = await this.userModel.findOne({
        phone_number: phoneNumber,
     
    })
    .select('+otp')
    .exec();

    if (!user) {
        this.logger.warn(`OTP verification failed for ${phoneNumber}. User not found.`);
        throw new NotFoundException('User not found.');
    }


    if (!user.otp || user.otp !== otp) {
         this.logger.warn(`OTP verification failed for ${phoneNumber}. Invalid OTP provided.`);
         throw new UnauthorizedException('Invalid OTP provided.');
    }

    try {
       
        await this.userModel.updateOne({ _id: user._id }, { $set: { otp: null } });
        this.logger.log(`OTP cleared for user ${phoneNumber}`);
    } catch(error) {
         this.logger.error(`Failed to clear OTP for user ${phoneNumber} after verification: ${error.message}`, error.stack);
         throw new InternalServerErrorException('Failed to finalize verification.');
    }

    this.logger.log(`OTP verified successfully for ${phoneNumber}. Generating token.`);

 
    const payload = {
       sub: user._id.toString(), 
       phone: user.phone_number,
    };

    try {
        const accessToken = await this.jwtService.signAsync(payload);

       
        const userToReturn = user.toObject(); 
        delete userToReturn.otp; 
        delete userToReturn.__v; 

        return {
          message: 'OTP verified successfully!',
        
          user: userToReturn,
          token: accessToken,
        };
    } catch (error) {
         this.logger.error(`Failed to sign JWT for user ${phoneNumber}: ${error.message}`, error.stack);
         throw new InternalServerErrorException('Authentication failed during token generation.');
    }
  }
}