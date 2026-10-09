const db = window.supabase.createClient(
    "https://zohowiegngyfactfdwzi.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvaG93aWVnbmd5ZmFjdGZkd3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMzE3MDAsImV4cCI6MjEwNjkwNzcwMH0.9lG1Q5SREYiWQQOIWi7goJOuj90DoGYwLcp2AfgHNoo"
);

async function getAwayTeam(wk, tm) {
    const {data: away_player_stats, error2} = await db 
    .from("week_player_stats") 
    .select("*")
    .eq("week", wk)
    .eq("team", tm) 
    ;
    console.log(away_player_stats);

    const container = document.getElementById("away-team");

    away_player_stats.forEach(stat => {
        const div = document.createElement("div");

        in2html = `
            ${stat.player_name}
        `;


        div.innerHTML = `${in2html}`;

        container.appendChild(div);

    });
}

async function getHomeTeam(wk, tm) {
    const {data: away_player_stats, error2} = await db 
    .from("week_player_stats") 
    .select("*")
    .eq("week", wk)
    .eq("team", tm) 
    ;
    console.log(away_player_stats);

    const container = document.getElementById("home-team");

    away_player_stats.forEach(stat => {
        const div = document.createElement("div");

        in2html = `
            ${stat.player_name}
        `;


        div.innerHTML = `${in2html}`;

        container.appendChild(div);

    });
}