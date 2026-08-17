import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnInit,
} from "@angular/core";
import { ApiService } from "src/app/services/apicore/api.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

@Component({
  selector: "app-totp-verify",
  templateUrl: "./totp-verify.component.html",
  styleUrls: ["./totp-verify.component.scss"],
})
export class TotpVerifyComponent implements OnInit {
  @Input() title: string = "Verificación de Dos Pasos";
  @Output() verified = new EventEmitter<boolean>();

  public isOtpInvalid = false;
  public loading = false;
  private otp: string[] = new Array(6).fill("");

  @ViewChild("otp0") otp0Element!: ElementRef<HTMLInputElement>;
  @ViewChild("otp1") otp1Element!: ElementRef<HTMLInputElement>;
  @ViewChild("otp2") otp2Element!: ElementRef<HTMLInputElement>;
  @ViewChild("otp3") otp3Element!: ElementRef<HTMLInputElement>;
  @ViewChild("otp4") otp4Element!: ElementRef<HTMLInputElement>;
  @ViewChild("otp5") otp5Element!: ElementRef<HTMLInputElement>;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
  ) {}

  ngOnInit() {
    // Focus first input automatically after view init
    setTimeout(() => {
      if (this.otp0Element) {
        this.otp0Element.nativeElement.focus();
      }
    }, 300);
  }

  getInputsArray(): HTMLInputElement[] {
    return [
      this.otp0Element.nativeElement,
      this.otp1Element.nativeElement,
      this.otp2Element.nativeElement,
      this.otp3Element.nativeElement,
      this.otp4Element.nativeElement,
      this.otp5Element.nativeElement,
    ];
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData("text").trim();

    if (pastedData && /^[0-9]{6}$/.test(pastedData)) {
      const inputs = this.getInputsArray();
      const digits = pastedData.split("");

      inputs.forEach((input, index) => {
        if (digits[index]) {
          input.value = digits[index];
        }
      });

      inputs[inputs.length - 1].focus();
      this.checkAndVerify();
    }
  }

  onInput(event: any, nextInput: HTMLInputElement | null) {
    const input = event.target;
    const value = input.value;

    if (!/^[0-9]$/.test(value)) {
      input.value = "";
      return;
    }

    if (value && nextInput) {
      nextInput.focus();
    }

    this.checkAndVerify();
  }

  onKeydown(event: KeyboardEvent, prevInput: HTMLInputElement | null) {
    const input = event.target as HTMLInputElement;

    if (event.key === "Backspace") {
      if (!input.value && prevInput) {
        prevInput.focus();
      }
    }
  }

  private checkAndVerify() {
    const inputs = this.getInputsArray();
    const code = inputs.map((i) => i.value).join("");

    if (code.length === 6) {
      this.otp = code.split("");
      this.verifyOtpCode(code);
    }
  }

  private verifyOtpCode(code: string) {
    this.loading = true;
    const token = sessionStorage.getItem("token");

    this.apiService.Validar_TOTP(code, token).subscribe(
      (data) => {
        this.loading = false;
        if (data && data.msj === "Ok") {
          this.verified.emit(true);
          this.activeModal.close(code);
        } else {
          this.handleOtpError();
        }
      },
      (error) => {
        this.loading = false;
        this.handleOtpError();
      },
    );
  }

  private handleOtpError() {
    this.isOtpInvalid = true;
    const inputs = this.getInputsArray();
    inputs.forEach((i) => (i.value = ""));

    setTimeout(() => {
      if (this.otp0Element) {
        this.otp0Element.nativeElement.focus();
      }
    }, 0);

    setTimeout(() => (this.isOtpInvalid = false), 500);
    this.cdr.detectChanges();
  }

  dismiss() {
    this.activeModal.dismiss("cancelled");
  }
}
