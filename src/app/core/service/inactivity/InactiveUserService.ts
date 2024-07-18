import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {InactiveUserTimesTypeEnum} from '../../type/inactive-user-times-type.enum';
import Swal from 'sweetalert2';
import {LoginService} from '../../../services/seguridad/login.service';

@Injectable({
    providedIn: 'root'
})
export class InactiveUserService {
    private timeoutId: any;
    private countdownId: any;
    private countdownValue: number;
    private showAlertsSecond: number;

    userInactive: Subject<boolean> = new Subject();

    constructor(private authService: LoginService) {
        this.reset();
        this.initListener();
    }

    initListener() {
        window.addEventListener('mousemove', () => this.reset());
        window.addEventListener('click', () => this.reset());
        window.addEventListener('keypress', () => this.reset());
        window.addEventListener('DOMMouseScroll', () => this.reset());
        window.addEventListener('mousewheel', () => this.reset());
        window.addEventListener('touchmove', () => this.reset());
        window.addEventListener('MSPointerMove', () => this.reset());
    }

    reset() {
        clearTimeout(this.timeoutId);
        clearTimeout(this.countdownId);
        this.startIdleTimer();
    }

    startIdleTimer() {
        this.timeoutId = setTimeout(() => {
            this.startCountdown(); }
            , InactiveUserTimesTypeEnum.IdleTime);
    }

    startCountdown() {
        this.countdownValue = InactiveUserTimesTypeEnum.CloseSessionCountdownTime / 1000;
        this.showAlertsSecond = InactiveUserTimesTypeEnum.AlertCountdownTimeMillisecons / 1000;
        this.countdownId = setInterval(() => {
            this.countdownValue--;
            if (this.countdownValue === this.showAlertsSecond) {
                this.alertInactivity();
            } else if (this.countdownValue <= 0) {
                clearInterval(this.countdownId);
                this.userInactive.next(true);
                this.alertCloseSession();
                this.authService.logout();
            }
        }, 1000);
    }

    alertInactivity() {
        Swal.fire({
            title: 'inactividad en sistema',
            text: '¿Estas alli, vuelve?',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, aqui estoy!'
        }).then((result) => {
            if (result.isConfirmed) {
                return ;
            }
        });
    }

    alertCloseSession() {
        Swal.fire({
            title: 'Cierre de sesion',
            text: 'Sesión expirada por inactividad!',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
        }).then((result) => {});
    }
}
