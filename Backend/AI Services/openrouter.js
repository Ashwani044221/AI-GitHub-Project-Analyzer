import axios from "axios";

const openrouteapi = async (prompt) => {
  try {
    // Fetch all available models
    const modelResponse = await axios.get(
      "https://openrouter.ai/api/v1/models",
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_API_KEY}`,
        },
      }
    );

    // Keep only free models
    const freeModels = modelResponse.data.data
      .map((model) => model.id)
      .filter((id) => id.endsWith(":free"));

    if (freeModels.length === 0) {
      throw new Error("No free models available.");
    }

    console.log("Available free models:");
    console.log(freeModels);

    // Try every free model
    for (const model of freeModels) {
      try {
        console.log(`Trying ${model}...`);

        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPEN_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(`Success with ${model}`);

        return response.data.choices[0].message.content;

      } catch (err) {
        console.log(`Failed: ${model}`);

        console.log(
          err.response?.data?.error?.message ||
          err.response?.data ||
          err.message
        );

        // Try the next model
      }
    }

    throw new Error("All free OpenRouter models are temporarily unavailable.");

  } catch (err) {
    console.error("OpenRouter Error:", err.message);
    throw err;
  }
};

export default openrouteapi;