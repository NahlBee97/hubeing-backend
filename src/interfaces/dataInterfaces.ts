// Note: You must also import the enums above

import { AppointmentStatus, UserRoles } from "@prisma/client";

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  password: string | null;
  imageUrl: string | null;
  role: UserRoles;
  createdAt: Date;

  // Relational fields
  tokens: IToken[];
  appointments: IAppointment[];
}

export interface IAppointment {
  id: string;
  appointmentDate: Date;
  queueNumber: number;
  status: AppointmentStatus;
  createdAt: Date;

  // Relational fields
  patientId: string;
  patient: IUser;
}

export interface IToken {
  id: string;
  userId: string;
  token: string;
  isValid: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relational fields
  user: IUser;
}
