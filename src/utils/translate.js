export async function translateText(text, targetLanguage) {
    const apiKey = "AIzaSyDjp5MG8hsEUaTM8nwiT0G1rb_60T_1FgI";
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            q: text,
            target: targetLanguage, // Language code (e.g., 'hi' for Hindi)
        }),
    });

    const data = await response.json();
    return data.data.translations[0].translatedText;
}
