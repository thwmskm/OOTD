// services/weatherService.ts

export interface DailyForecast {
  date: string; // YYYY-MM-DD
  tempMax: number;
  tempMin: number;
  precipitationProbability: number; // 0-100
  weatherCode: number; // WMO code
  windSpeed: number;
}

export interface WeatherForecast {
  current: {
    temp: number;
    weatherCode: number;
    windSpeed: number;
  };
  daily: DailyForecast[];
}

// WMO weather interpretation codes → human-readable label + emoji
export const interpretWeatherCode = (code: number): { label: string; emoji: string } => {
  if (code === 0)           return { label: 'Clear Sky', emoji: '☀️' };
  if (code <= 2)            return { label: 'Partly Cloudy', emoji: '⛅' };
  if (code === 3)           return { label: 'Overcast', emoji: '☁️' };
  if (code <= 49)           return { label: 'Foggy', emoji: '🌫️' };
  if (code <= 57)           return { label: 'Drizzle', emoji: '🌦️' };
  if (code <= 67)           return { label: 'Rain', emoji: '🌧️' };
  if (code <= 77)           return { label: 'Snow', emoji: '❄️' };
  if (code <= 82)           return { label: 'Rain Showers', emoji: '🌦️' };
  if (code <= 86)           return { label: 'Snow Showers', emoji: '🌨️' };
  if (code <= 99)           return { label: 'Thunderstorm', emoji: '⛈️' };
  return { label: 'Unknown', emoji: '🌡️' };
};

export const fetchWeatherForecast = async (
  latitude: number,
  longitude: number,
  days: number = 16 // max 16 for free daily forecast
): Promise<WeatherForecast | null> => {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', latitude.toString());
    url.searchParams.set('longitude', longitude.toString());
    url.searchParams.set('daily', [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'weather_code',
      'wind_speed_10m_max',
    ].join(','));
    url.searchParams.set('current', [
      'temperature_2m',
      'weather_code',
      'wind_speed_10m',
    ].join(','));
    url.searchParams.set('timezone', 'auto'); // auto-detects from coordinates
    url.searchParams.set('forecast_days', days.toString());
    url.searchParams.set('temperature_unit', 'celsius'); // or 'fahrenheit'

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`Weather API error: ${response.status}`);
    const data = await response.json();

    const daily: DailyForecast[] = data.daily.time.map((date: string, i: number) => ({
      date,
      tempMax: Math.round(data.daily.temperature_2m_max[i]),
      tempMin: Math.round(data.daily.temperature_2m_min[i]),
      precipitationProbability: data.daily.precipitation_probability_max[i] ?? 0,
      weatherCode: data.daily.weather_code[i],
      windSpeed: Math.round(data.daily.wind_speed_10m_max[i]),
    }));

    return {
      current: {
        temp: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
        windSpeed: Math.round(data.current.wind_speed_10m),
      },
      daily,
    };
  } catch (error) {
    console.error('Failed to fetch weather forecast:', error);
    return null;
  }
};