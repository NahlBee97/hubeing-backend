import { prisma } from "../lib/prisma";

export async function GetUserAppointmentByDateService(
  date: Date,
  userId: string
) {
  try {
    const appointments = await prisma.appointments.findMany({
      where: {
        patientId: userId,
        appointmentDate: date,
      },
      include: {
        patient: true,
      },
    });
    return appointments;
  } catch (error) {
    throw error;
  }
}

export async function GetUserAppointmentsService(
  userId: string,
  isPast: string
) {
  const today = new Date();

  try {
    let appointments = [];
    if (isPast === "true") {
      appointments = await prisma.appointments.findMany({
        where: {
          patientId: userId,
          appointmentDate: {
            lt: today,
          },
        },
        include: {
          patient: true,
        },
      });
    } else {
      appointments = await prisma.appointments.findMany({
        where: {
          patientId: userId,
          appointmentDate: {
            gte: today,
          },
        },
        include: {
          patient: true,
        },
      });
    }

    return appointments;
  } catch (error) {
    throw error;
  }
}

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
