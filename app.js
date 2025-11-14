async function haeSaa(kaupunki) {
    const apiKey = "63e339fef07aecacd6e5dc0418f0196d";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${kaupunki}&appid=${apiKey}&units=metric&lang=fi`;
    try {
        const vastaus = await fetch(url);
        const data = await vastaus.json();
        return data;
    } catch (error) {
        console.error("", error);
        return null;
    }
}

async function naytaSaa(kaupunki, elementId) {
    const tulos = document.querySelector(`#${elementId}`);
    const data = await haeSaa(kaupunki);
    const kuvaus = data.weather[0].description;
    const lampo = Math.round(data.main.temp);
    const ikoni = data.weather[0].icon;

    tulos.innerHTML = `
        <h2>${data.name}</h2>
        <img src="https://openweathermap.org/img/wn/${ikoni}@2x.png">
        <p>${kuvaus}, ${lampo} °C</p>
        <button onclick="hae5pvSaa('${data.name}', 'ennuste')">Hae 5pv sää</button>
    `;
}

async function hae5pvSaa(kaupunki, elementId) {
    const apiKey = "63e339fef07aecacd6e5dc0418f0196d";
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${kaupunki}&appid=${apiKey}&units=metric&lang=fi`;
    try {
        const vastaus = await fetch(url);
        const data = await vastaus.json();
        const tulos = document.querySelector(`#${elementId}`);

        if (!data || !Array.isArray(data.list) || data.list.length === 0) {
            tulos.innerHTML = `<p>Ennustetta ei löytynyt.</p>`;
            return null;
        }

        const desiredIndices = [1, 9, 17, 25, 33].filter(i => i < data.list.length);

        const entries = desiredIndices.map(i => {
            const item = data.list[i];
            const dt = new Date(item.dt * 1000);
            const day = dt.getDate().toString().padStart(2, '0');
            const month = (dt.getMonth() + 1).toString().padStart(2, '0');
            return {
                date: `${day}.${month}`,
                temp: Math.round(item.main.temp),
                desc: item.weather && item.weather[0] ? item.weather[0].description : ''
            };
        });

        tulos.innerHTML = `
        <h2>${kaupunki} 5vrk Ennuste</h2>
        ${entries.map(e => `<p>${e.date}, ${e.temp} °C${e.desc ? ' — '+e.desc : ''}</p>`).join('')}    `;

        return data;
    } catch (error) {
        console.error("", error);
        const tulos = document.querySelector(`#${elementId}`);
        if (tulos) tulos.innerHTML = `<p>Virhe haettaessa ennustetta.</p>`;
        return null;
    }
}

function piilota() {
  var x = document.getElementById("ennuste");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}



async function haeSaat() {
    await naytaSaa("raahe", "raahe");
    await naytaSaa("zlin", "zlin");
    await naytaSaa("girona", "girona");
    await naytaSaa("brussels", "bryssel");
}

  haeSaat();