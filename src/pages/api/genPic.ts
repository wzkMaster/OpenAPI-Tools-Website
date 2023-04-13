import type { APIRoute } from "astro";

const apiKey = import.meta.env.OPENAI_API_KEY;

export const post: APIRoute = async (context) => {
  const body = await context.request.json();
  const { prompt, size } = body;
  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        method: "POST",
        body: JSON.stringify({
          prompt,
          n: 1,
          size
        }),
      }
    );
    const imageUrl = (await response.json()).data[0].url;

    return new Response(
      JSON.stringify({
        imageUrl,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      { status: 500 }
    );
  }

};
