import { Twilio } from "twilio";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "./customer.entity";
import { twilioConfig } from "../config";

@Injectable()
export class CustomerService {
  private twilioClient: Twilio;

  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>
  ) {
    this.twilioClient = new Twilio(
      twilioConfig.accountSid,
      twilioConfig.authToken
    );
  }

  async sendOtpViaSms(phone: string, otp: string): Promise<void> {
    await this.twilioClient.messages.create({
      body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      from: twilioConfig.phoneNumber,
      to: `+91${phone}`, // Indian phone numbers
    });
  }

  async generateOtp(phone: string): Promise<{ message: string } | void> {
    const customer = await this.customerRepo.findOne({ where: { phone } });
    if (!customer) {
      return { message: "No customer found with this mobile number" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    customer.otp = otp;
    customer.otpExpiry = otpExpiry;
    await this.customerRepo.save(customer);

    // Send OTP via SMS
    await this.sendOtpViaSms(phone, otp);
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const customer = await this.customerRepo.findOne({ where: { phone } });
    if (
      !customer ||
      customer.otp !== otp ||
      !customer.otpExpiry ||
      customer.otpExpiry < new Date()
    ) {
      return false;
    }

    // Clear OTP after successful verification
    customer.otp = null;
    customer.otpExpiry = null;
    await this.customerRepo.save(customer);

    return true;
  }
}
