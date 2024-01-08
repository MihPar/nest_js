import { Injectable } from '@nestjs/common';
import { EmailAdapter } from '../adapter/email.adapter';

@Injectable()
export class EmailManager {
	constructor(
		protected emailAdapter: EmailAdapter
	) {
	}
	async sendEamilConfirmationMessage(email: string, code: string): Promise<void> {
		const result = await this.emailAdapter.sendEmail(email, code)
		return result
	}
	async sendEamilRecoveryCode(email: string, recoveryCode: string) {
		const result = await this.emailAdapter.sendEmailByRecoveryCode(email, recoveryCode)
		return result
	}
}
