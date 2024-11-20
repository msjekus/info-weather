import './WeatherForm.css';
import { useRef, useState, useEffect } from "react";
const WeatherForm = () => {
    const inpCity = useRef('');
    const inpCoutry = useRef('');
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [thema, setThema] = useState("day");
    const [settings, setSettings] = useState({
        textColor: "#636363",
        backgroundColor: "#d9d9d9",
        favorite: "",
    });

    const updateTheme = () => {
        const currentHour = new Date().getHours();
        setThema(currentHour >= 6 && currentHour < 18 ? "day" : "night");
    };

    useEffect(() => {
        updateTheme();
        const savedSettings = JSON.parse(localStorage.getItem("weatherAppSettings"));
        if (savedSettings) {
            setSettings(savedSettings);
        }
    }, []);

    useEffect(() => {
        document.body.style.backgroundColor = settings.backgroundColor;
        document.body.style.color = settings.textColor;
    }, [settings]);
    const clickHandle = () => {
        const city = inpCity.current.value.trim();
        const country = inpCoutry.current.value.trim();
        if (!city) {
            setError("Введіть назву міста.");
            return;
        }

        if (!country) {
            setError("Введіть назву країни");
            return;
        }
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inpCity.current.value},&appid=${apiKey}&units=metric&lang=ua`)
            .then((resp) => {
                if (!resp.ok) {
                    throw new Error("Такого міста нема")

                }
                // console.log(resp.json());

                return resp.json();
            })

            .then((data) => {
                setWeather(data);
                setError(null);
                console.log(data);
            })

            .catch((err) => {
                setError(err.message);
                setWeather(null);
            });

    };
    const handleSettingsChange = (e) => {
        const { name, value } = e.target;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const saveSettings = () => {
        localStorage.setItem("weatherAppSettings", JSON.stringify(settings));
        alert("Налаштування збережено!");
    };

    const isDay = weather?.sys?.sunrise * 1000 <= Date.now() && Date.now() <= weather?.sys?.sunset * 1000;

    return (
        <div className={`${thema === "day" ? { textColor: "#2b2b2b", backgroundColor: "#fafafa" } : { textColor: "#fafafa", backgroundColor: "#2b2b2b" }}`}>

            <h1 > Погода у вашому місті:</h1>
            <div className='weather'>
                <div className="col-3">
                    <h3>Введіть назву вашого міста:</h3>
                    <input type="text" ref={inpCity} className="form-control my-3" placeholder="Наприклад: Одеса"></input>
                    <h3>Введіть назву вашої країни:</h3>
                    <input type="text" ref={inpCoutry} className="form-control my-3" placeholder="Наприклад: Україна"></input>
                </div>
                <button type="button" className="btn btn-outline-success" onClick={clickHandle}>Отримати</button>


                {error && <p className="text-danger mt-3">{error}</p>}

                {weather && (
                    <div className="mt-3">
                        <h3>Місто: {weather.name}</h3>
                        <p>Температура: {weather.main.temp}°C</p>
                        <p>Вологість: {weather.main.humidity}%</p>
                        <p>Опис: {weather.weather[0].description}</p>

                        <p>Час сходу сонця: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
                        <p>Час заходу сонця:{new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
                        <img
                            src={isDay ? "https://openweathermap.org/img/wn/01d@2x.png" : " https://openweathermap.org/img/wn/01n@2x.png"}
                            alt={isDay ? "Сонце" : "Місяць"}
                            width="100" />

                    </div>

                )}
            </div>
            <div className="seting">
                <h3 className="mt-5">Налаштування</h3>

                <label>Колір тексту:</label>

                <div >
                    <input type="color" name="textColor" value={settings.textColor}
                        onChange={handleSettingsChange} className="form-control mb-3" />
                    <label>Колір Фону:</label>
                    <input type="color" name="backgroundColor" value={settings.backgroundColor}
                        onChange={handleSettingsChange} className="form-control mb-3" />
                    <label>Улюблене місто:</label>
                    <input type="text" name="favorite" value={settings.favorite}
                        onChange={handleSettingsChange} className="form-control mb-3" />
                </div>
                <button className="btn btn-outline-primary" onClick={saveSettings}>Зберегти</button>


            </div>


        </div>
    )
}
export default WeatherForm;