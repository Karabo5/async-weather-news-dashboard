import https from 'https'
import 'dotenv/config'
import { error } from 'console';

const WEATHER_URL = process.env.WEATHER_API!;
const NEWS_URL = process.env.NEWS_API!;

function getData(url:string) : Promise<any> {
    return new Promise((resolve,reject) => {
        https.get(url, (res) =>{
            let raw = "";

            res.on("data", (chunk) =>{
                raw += chunk
            })

            res.on("end", () =>{
                try {
                    const parsed = JSON.parse(raw);
                    resolve(parsed)

                } catch (error) {
                    reject(error)
                }
            })
        }).on("error", (error) => reject(error));
    })
}

getData(WEATHER_URL) .then((weather) =>{
    console.log("Weather fetched:" , weather.current_weather);
    return getData(NEWS_URL)
    
}).then((news) => {
    console.log("News fetched:", news.posts.map((p: any) => p.title));
    console.log("\nAll data fetched successfully");  
    
}).catch((error) =>{
    console.error("Error:", (error as Error).message);
    
})

Promise.all([getData(WEATHER_URL), getData(NEWS_URL)])
    .then(([weather , news]) =>{

        console.log("\n=== Promise.all operation ===");
        console.log("Weather:", weather.current_weather);
        console.log("News:", news.posts.map((p:any) => p.title));        
    
    }).catch((error) => {
        console.error("Promise.all error:", (error as Error).message);
        
    })

Promise.race([getData(WEATHER_URL), getData(NEWS_URL)])
    .then((fastest) =>{
        console.log("\n=== Promise.race operation ===");
        console.log("Fastest response:", fastest);        
    
    }).catch((error) => {
        console.error("Promise.race error:", (error as Error).message);
        
    }) 

