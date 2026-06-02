import { create } from 'zustand';
import { WeatherForecast, DailyForecast, fetchWeatherForecast } from '../weatherService';

type WeatherStore = {
  forecast: WeatherForecast | null;
  isLoading: boolean;
  lastFetched: string | null; // YYYY-MM-DD — avoid re-fetching same day
  latitude: number | null;
  longitude: number | null;
  loadForecast: (lat: number, lon: number) => Promise<void>;
  getForecastForDate: (date: string) => DailyForecast | undefined;
};

const useWeatherStore = create<WeatherStore>((set, get) => ({
  forecast: null,
  isLoading: false,
  lastFetched: null,
  latitude: null,
  longitude: null,

  loadForecast: async (lat: number, lon: number) => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Skip re-fetch if already loaded today at same location
    const { lastFetched, latitude, longitude } = get();
    if (lastFetched === today && latitude === lat && longitude === lon) return;

    set({ isLoading: true });
    const forecast = await fetchWeatherForecast(lat, lon, 16);
    set({ forecast, isLoading: false, lastFetched: today, latitude: lat, longitude: lon });
  },

  getForecastForDate: (date: string) => {
    return get().forecast?.daily.find(d => d.date === date);
  },
}));

export default useWeatherStore;