// prisma/seed.ts
import { env } from "@/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../migrate/generated/client";
// Import themes - Note: This requires a TypeScript runner like tsx or ts-node
// If using plain Node.js, you may need to: pnpm add -D tsx
// Then update prisma.config.ts seed command to: "tsx prisma/seed.js"

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
});

export const themes = {
  // ==================== DAKTILO / NOIR ====================
  daktilo: {
    name: "Daktilo",
    description: "Современный и чистый",
    mode: "light",
    colors: {
      primary: "#3B82F6",
      secondary: "#1F2937",
      accent: "#60A5FA",
      background: "#FFFFFF",
      text: "#1F2937",
      heading: "#3B82F6",
      smartLayout: "#3B82F6",
      cardBackground: "#F3F4F6",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    borderRadius: "0.5rem",
    transitions: {
      default: "all 0.2s ease-in-out",
    },
    shadows: {
      card: "0 1px 3px rgba(0,0,0,0.12)",
      button: "0 2px 4px rgba(59,130,246,0.1)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #3B82F615 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #60A5FA15 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #1F293710 0%, transparent 50%),
        #FFFFFF
      `,
    },
  },

  noir: {
    name: "Noir",
    description: "Эстетика нуар",
    mode: "dark",
    colors: {
      primary: "#60A5FA",
      secondary: "#E5E7EB",
      accent: "#93C5FD",
      background: "#111827",
      text: "#E5E7EB",
      heading: "#60A5FA",
      smartLayout: "#60A5FA",
      cardBackground: "#1F2937",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    borderRadius: "0.5rem",
    transitions: {
      default: "all 0.2s ease-in-out",
    },
    shadows: {
      card: "0 1px 3px rgba(0,0,0,0.3)",
      button: "0 2px 4px rgba(96,165,250,0.2)",
    },
    background: {
      type: "radial",
      override: `
        radial-gradient(circle at 10% 10%, #60A5FA20 0%, transparent 30%),
        radial-gradient(circle at 90% 20%, #93C5FD20 0%, transparent 40%),
        radial-gradient(circle at 50% 80%, #E5E7EB15 0%, transparent 50%),
        #111827
      `,
    },
  }
}

async function main() {
  const systemUser = await prisma.user.upsert({
    where: { email: "system@allweone.com" },
    update: {},
    create: {
      id: "0",
      email: "system@allweone.com",
      name: "ALLWEONE System",
    },
  });

  // Seed all built-in themes
  for (const [themeKey, data] of Object.entries(themes)) {
    const { name, description, ...themeData } = data;
    try {
      const customTheme = await prisma.presentationTheme.upsert({
        where: { id: themeKey },
        update: {
          name: name,
          description: description,
          themeData: themeData,
          isPublic: true,
          updatedAt: new Date(),
        },
        create: {
          id: themeKey,
          name: name,
          description: description,
          themeData: themeData,
          isPublic: true,
          userId: systemUser.id,
          isAdmin: true,
        },
      });

      console.log(`✓ Тема импортирована: ${customTheme.name} (${themeKey})`);
    } catch (error) {
      console.error(`✗ Ошибка импорта темы ${themeKey}:`, error);
    }
  }

  console.log("\nИмпорт тем завершён!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
