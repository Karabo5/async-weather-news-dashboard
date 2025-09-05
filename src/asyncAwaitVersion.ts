import https from 'https'
import "dotenv/config"

const WEATHER_URL = process.env.WEATHER_API!;
const NEWS_URL = process.env.NEWS_API!;

function getData(url:string) : Promise<any> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let raw = "";

            res.on("data", (chunk) => {
                raw += chunk;
            })

            res.on("end", () =>{
                try {
                    const parsed = JSON.parse(raw)
                    resolve(parsed)

                } catch (error) {
                    reject(error)
                }
            })
        }).on("error", (error) => reject(error))
    })
}

async function fetchData(){
    try {
        const weather = await getData(WEATHER_URL)
        console.log("Weather fetched:", weather.current_weather);

        const news = await getData(NEWS_URL)
        console.log("News fetched:", news.posts.map((p: any) => p.title));
        
        console.log("\nAll data fetched successfully");
         
    } catch (error) {
        console.error("Error in fetching data:", (error as Error).message);
        
    }
}

async function fetchPromiseAll(){
    try {
        const [weather, news] = await Promise.all([
            getData(WEATHER_URL),
            getData(NEWS_URL)
        ])

        console.log("===\nRunningg Promise.all ===");
        console.log("Weather:", weather.current_weather);
        console.log("News:", news.posts.map((p:any) => p.title));
        
    } catch (error) {
        console.error("Error in running promise.all:", (error as Error).message);
        
    }
}

async function fetchRace(){
    try {
        const fastest = await Promise.race([
            getData(WEATHER_URL),
            getData(NEWS_URL)
        ])

        console.log("Fastest response:", fastest);
        
    } catch (error) {
        console.error("Error in promise.race", (error as Error).message);
        
    }
}

fetchData();
fetchPromiseAll();
fetchRace();