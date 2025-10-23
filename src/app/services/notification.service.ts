import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	constructor(private toastrService: ToastrService) { }

	success(message: string, title?: string): void {
		this.toastrService.success(message, title);
	}

	error(message: string, title?: string): void {
		this.toastrService.error(message, title);
	}

	warning(message: string, title?: string): void {
		this.toastrService.warning(message, title);
	}

	info(message: string, title?: string): void {
		this.toastrService.info(message, title);
	}
}
