export async function GET() {
    return new Response(JSON.stringify({ name: "Hello", name2: "World!" }));
}
