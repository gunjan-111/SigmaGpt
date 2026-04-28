import "dotenv/config";

const getOpenAIAPIResponse = async(message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{
                role: "user",
                content: message
            }]
        })
    };

    try {
        // const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        // const data = await response.json();
        // return data.choices[0].message.content; //reply
        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            options
        );

        const data = await response.json();


        console.log("GROQ API response:", data); // debug

        if (!data.choices) {
            throw new Error(JSON.stringify(data));
        }

        return data.choices[0].message.content;

    } catch (err) {
        console.error("GROQ ERROR:", err);
        return "Error generating AI response";
    }
}

export default getOpenAIAPIResponse;