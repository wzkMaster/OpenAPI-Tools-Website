import type { APIRoute } from "astro";
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: import.meta.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const post: APIRoute = async (context) => {
  const body = await context.request.json();
  const { prompt, size } = body;
  console.log(body);
  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size,
    });

    const imageUrl = response.data.data[0].url;

    return new Response(
      JSON.stringify({
        imageUrl,
      }),
      { status: 200 }
    );
  } catch (error) {
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
