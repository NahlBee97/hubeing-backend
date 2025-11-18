import { PrismaClient, UserRoles, AppointmentStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Helper: Generate date in 2025, strictly BEFORE Nov 18th
const getDateIn2025 = (index: number) => {
  const year = 2025;

  // Cycle through Jan (0) to Nov (10).
  // 100 records % 11 months = ~9 records per month.
  const month = index % 11;

  let maxDay: number;

  if (month === 10) {
    // If November (index 10), limit to the 17th
    maxDay = 17;
  } else {
    // For Jan-Oct, get the full number of days in that month
    maxDay = new Date(year, month + 1, 0).getDate();
  }

  const day = Math.floor(Math.random() * maxDay) + 1;

  // Random hour/minute
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);

  return new Date(year, month, day, hour, minute);
};

async function main() {
  console.log("🌱 Starting seed (Restricted: < Nov 18, 2025)...");

  // 1. Clean up existing data
  await prisma.tokens.deleteMany();
  await prisma.appointments.deleteMany();
  await prisma.users.deleteMany();

  const usersData = [];
  const appointmentsData = [];
  const tokensData = [];

  for (let i = 0; i < 100; i++) {
    // --- 1. Generate User ---
    const userId = faker.string.uuid();
    const userCreatedAt = getDateIn2025(i);

    usersData.push({
      id: userId,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: faker.internet.password(),
      role: i % 10 === 0 ? UserRoles.ADMIN : UserRoles.USER,
      imageUrl: faker.image.avatar(),
      createdAt: userCreatedAt,
    });

    // --- 2. Generate Appointment ---
    // We ensure the appointment is booked *after* the user is created.
    // Note: The appointment date ITSELF might fall after Nov 18th (future booking),
    // but the 'createdAt' (booking timestamp) will be before Nov 18th.
    const appointmentDate = new Date(userCreatedAt);
    appointmentDate.setDate(
      appointmentDate.getDate() + Math.floor(Math.random() * 7) + 1
    );

    appointmentsData.push({
      id: faker.string.uuid(),
      patientId: userId,
      appointmentDate: appointmentDate,
      queueNumber: i + 1,
      status: faker.helpers.enumValue(AppointmentStatus),
      createdAt: userCreatedAt, // Strictly < Nov 18th
    });
  }

  console.log("1️⃣  Creating Users...");
  await prisma.users.createMany({ data: usersData });

  console.log("2️⃣  Creating Appointments...");
  await prisma.appointments.createMany({ data: appointmentsData });

  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
