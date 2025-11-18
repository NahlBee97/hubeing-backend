import { prisma } from "../lib/prisma";

export async function GetAppointmentSummaryService() {
  try {
    const appointmentData = await prisma.appointments.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });

    const targetYear = 2025;

    const rawResult: { month: string; count: number }[] =
      await prisma.$queryRaw`
  SELECT 
    DATE_TRUNC('month', "createdAt") as month, 
    COUNT(id)::int as count 
  FROM "Appointments"
  WHERE EXTRACT(YEAR FROM "createdAt") = 2025
  GROUP BY DATE_TRUNC('month', "createdAt") 
  ORDER BY month ASC;
`;

    const totalAppointmentsByMonth = rawResult.map(
      (dataPoint: { month: string; count: number }) => {
        return {
          // Convert the Date object to a short month string (e.g., "Jan", "Feb")
          name: new Date(dataPoint.month).toLocaleString("default", {
            month: "short",
          }),
          value: dataPoint.count,
        };
      }
    );

    const booked =
      appointmentData.find((data: any) => data.status === "BOOKED")?._count
        .status || 0;
    const cancelledByAdmin =
      appointmentData.find((data: any) => data.status === "CANCELLED_ADMIN")
        ?._count.status || 0;
    const cancelledByUser =
      appointmentData.find((data: any) => data.status === "CANCELLED_USER")
        ?._count.status || 0;
    const completed =
      appointmentData.find((data: any) => data.status === "COMPLETED")?._count
        .status || 0;

    const summary = {
      booked,
      completed,
      cancelledByUser,
      cancelledByAdmin,
      totalAppointmentsByMonth
    };

    return summary;
  } catch (error) {
    throw error;
  }
}

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
