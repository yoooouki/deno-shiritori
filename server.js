import { serve } from "https://deno.land/std@0.138.0/http/server.ts"
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

let saisho = ['さかな', 'かし', 'あいす', 'たんす', 'なす', 'はす', 'まうす', 'やす', 'らいす', 'わーきんぐすぺーす'];
let previousWord = saisho[Math.floor(Math.random()*saisho.l)];
let tango = [];

console.log("Listening on http://localhost:8000");
serve(async(req) => {
    const pathname = new URL(req.url).pathname;
    console.log(pathname);

    if (req.method === "GET" && pathname === "/shiritori") {
        previousWord = saisho[Math.floor(Math.random()*11)];
        tango = [previousWord];
        return new Response(JSON.stringify(tango));
    }

    if (req.method === "POST" && pathname === "/shiritori") {
        const requestJson = await req.json();
        const nextWord = requestJson.nextWord;
        if (
            nextWord.length > 0 &&
            previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)
        ) {
            return new Response("前の単語に続いていません。", { status: 400 });
        }

        if(
            tango.includes(nextWord)
        ){
            return new Response("重複しています。", { status: 400});
        }

        if (
            nextWord.charAt(nextWord.length - 1) === "ん"
        ){
            return new Response("ん");
        }
        previousWord = nextWord;
        tango.push(nextWord);
        return new Response(JSON.stringify(tango));
    }
    
    return serveDir(req, {
        fsRoot: "public",
        urlRoot: "",
        showDirListing: true,
        enableCors: true,
    });
});
