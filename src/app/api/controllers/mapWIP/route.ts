export async function GET(request:any) {
    const path = new URL(request.url).pathname;
  
    return new Response(JSON.stringify({
      message: "Это пока находи",
      path: path, 
      status: "success"
    }), {
      headers: { "Content-Type": "application/json" } 
    });
}