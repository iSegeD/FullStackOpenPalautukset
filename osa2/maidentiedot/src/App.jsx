import { useEffect, useState } from "react";
import countryServices from "./services/countries";
import Display from "./components/Display";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    countryServices.getAll().then((jsonData) => {
      const marker = jsonData.map((item) => ({
        ...item,
        showDetails: false,
      }));
      setCountries(marker);
    });
  }, []);

  useEffect(() => {
    const filter = countries.filter((item) =>
      item.name.common.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (filter.length === 1) {
      const target = filter[0];
      countryServices.getWeather(target.capital).then((jsonData) => {
        setWeather(jsonData);
      });
    } else {
      setWeather(null);
    }
  }, [searchValue, countries]);

  const toggleDetails = (name) => {
    setCountries(
      countries.map((item) =>
        item.name.common === name
          ? { ...item, showDetails: !item.showDetails }
          : item
      )
    );
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div>
      Find countries:{" "}
      <input type="text" value={searchValue} onChange={handleInputChange} />
      <Display
        countries={countries}
        searchValue={searchValue}
        toggleDetails={toggleDetails}
        weather={weather}
      />
    </div>
  );
};

export default App;
