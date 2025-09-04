import https from 'https'
import dotenv from 'dotenv'

dotenv.config();

const WEATHER_URL = process.env.WEATHER_API!;
const NEWS_URL = process.env.NEWS_API!;

function getJSON(url:string, callback:(error: Error | null, data?: any) => void){
    https.get(url, (res) => {
        let body = "";

        res.on("data", (chunk) =>{
            body += chunk;
        });

        res.on("end", () => {
            try {
                const parsed = JSON.parse(body);
                callback(null, parsed);

            } catch (error) {
                callback(error as Error)
            }
        })
    }).on("error", (error:Error) => {
        callback(error)
    })
};

console.log("\n=== Callback Version ===");

getJSON(WEATHER_URL, (error,weather) => {
    if(error){
        console.error("Weather error:", error.message)
        return
    }

    console.log('Weather fetched:' , weather.current_weather);

    getJSON(NEWS_URL, (error, news) => {
        if(error){
            console.error("News error:" , error.message)
            return;
        }

        console.log("News fetched:", news.posts.map((p:any) => p.title));

        console.log("\nAll data fetchef successfully!")
    })
})
