import { useEffect } from 'react';
import * as Location from 'expo-location';
import useWeatherStore from '../../services/stores/weatherStore';

const useWeather = () => {
  const loadForecast = useWeatherStore(state => state.loadForecast);
  const forecast = useWeatherStore(state => state.forecast);
  const isLoading = useWeatherStore(state => state.isLoading);

  useEffect(() => {
    const init = async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      await loadForecast(location.coords.latitude, location.coords.longitude);
    };

    init();
  }, []);

  return { forecast, isLoading };
};

export default useWeather;