export interface ProfileFormData {
  fullName: string;
  phone: string;
  email: string;
  website: string;
  subscribeEmail: boolean;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone: string;
  email: string;
  website: string;
  subscribeEmail: boolean;
}

export class UpdateProfileError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = "UpdateProfileError";
  }
}
