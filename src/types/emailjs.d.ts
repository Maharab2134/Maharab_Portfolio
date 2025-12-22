declare module '@emailjs/browser' {
  export interface EmailJSResponse {
    status: number;
    text: string;
  }

  export interface EmailJSParams {
    [key: string]: string | number | boolean;
  }

  export function send(
    serviceID: string,
    templateID: string,
    templateParams: EmailJSParams,
    publicKey: string
  ): Promise<EmailJSResponse>;

  export function init(publicKey: string): void;
} 