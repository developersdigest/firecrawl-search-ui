import { Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react';

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export function WeatherCard({ weather }: { weather: WeatherData }) {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-semibold">{weather.city}</h3>
          <p className="text-4xl font-bold mt-2">{weather.temperature}°C</p>
          <p className="text-muted-foreground capitalize">{weather.condition}</p>
        </div>
        <div className="text-right">
          {getWeatherIcon(weather.condition)}
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Wind className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{weather.windSpeed} km/h</span>
        </div>
        <div className="flex items-center space-x-2">
          <Droplets className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{weather.humidity}%</span>
        </div>
      </div>
    </div>
  );
}