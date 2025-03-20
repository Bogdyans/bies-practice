export async function GET() {
    return new Response(JSON.stringify({ name: "Hello", name2: "World!" }));
}
/*
export async function POST(request: Request) {
    try {
        // Получаем тело запроса и преобразуем его в JSON
        const body = await request.json();

        // Возвращаем ответ с тем же объектом
        return new Response(JSON.stringify(body), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        // Обработка ошибок, если тело запроса не является валидным JSON
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}*/