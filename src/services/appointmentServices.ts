import { prisma } from "../lib/prisma";

export async function CreateAppointmentService(
  appointmentDate: Date,
  userId: string
) {
  try {
    const result = await prisma.appointments.aggregate({
      _max: {
        queueNumber: true, // Tell Prisma you want the "max" of this field
      },
      where: {
        appointmentDate, // Filter by the specific date
      },
    });

    const maxQueueNumber = result._max.queueNumber ?? 0;

    await prisma.appointments.create({
      data: {
        appointmentDate,
        queueNumber: maxQueueNumber + 1,
        patientId: userId,
      },
    });
  } catch (error) {
    throw error;
  }
}
