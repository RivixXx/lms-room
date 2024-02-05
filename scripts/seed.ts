const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();


// Добовляем пункты в dropdown: node scripts/seed.ts
async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Тахография" },
                { name: "Навигация" },
                { name: "Wialon" },
                { name: "ГлонассСофт" },
                { name: "Монтаж" },
                { name: "1C" },
            ]
        });

        console.log("Success");
    } catch (error) {
        console.log("Error seeding the database categories", error);
    } finally {
        await database.$disconnect();
    }
}

main();