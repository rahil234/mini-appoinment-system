export interface CreateAppointmentDTO {
  title: string;
  date: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  userId: string;
}
