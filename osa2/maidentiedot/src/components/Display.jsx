const Display = ({ countries, searchValue, toggleDetails, weather }) => {
  const filter = countries.filter((item) =>
    item.name.common.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (!searchValue) {
    return <p>Start typing to search for countries...</p>;
  }

  if (filter.length > 10) {
    return <p>Too many mathces, specify another filter</p>;
  }

  if (filter.length > 1) {
    return (
      <ul className="main__ul">
        {filter.map((item) => (
          <li key={item.name.common}>
            {item.name.common}
            <button
              className="detail__btn"
              onClick={() => toggleDetails(item.name.common)}
            >
              {item.showDetails ? "Hide" : "Show"}
            </button>
            {item.showDetails && (
              <div>
                <h1>{item.name.common}</h1>
                <p>Capital: {item.capital}</p>
                <p>Area: {item.area}</p>
                <h2>Languages</h2>
                <ul>
                  {Object.values(item.languages).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <img src={item.flags.png} alt="Country flag" />
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (filter.length === 1) {
    const target = filter[0];
    const { name, capital, area, languages, flags } = target;

    return (
      <div>
        <h1>{name.common}</h1>
        <p>Capital: {capital}</p>
        <p>Area: {area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(languages).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <img src={flags.png} alt="Country flag" />

        {weather && (
          <div>
            <h2>Weather in {capital}</h2>
            <p>
              Temperature:{" "}
              {weather.main.temp > 0
                ? `+${weather.main.temp}`
                : `-${weather.main.temp}`}{" "}
              Celsius
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
            <p>Wind: {weather.wind.speed} m/s</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Display;
