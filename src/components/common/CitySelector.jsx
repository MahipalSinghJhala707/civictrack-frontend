import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/admin.service';
import { logger } from '../../utils/logger';

/**
 * City Selector Component for Admin Views
 * 
 * BACKEND CONTRACT:
 * - Admin APIs require explicit city context
 * - Pass cityId with every admin API call
 * - includeAllCities=true is explicit opt-in for cross-city access
 * 
 * UI REQUIREMENTS:
 * - City selection is required by default
 * - "All Cities" option must be explicit and clearly indicated
 * - Component shows visual indicator when in cross-city mode
 */
const CitySelector = ({
  selectedCityId,
  onCityChange,
  includeAllCities = false,
  onIncludeAllCitiesChange,
  allowAllCities = true,
  className = '',
}) => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.listCities();
      const citiesData = response.data?.data?.cities || 
                        response.data?.cities || 
                        response.data?.data || 
                        [];
      setCities(citiesData);
      
      // Auto-select first city if none selected and not in all-cities mode
      if (!selectedCityId && !includeAllCities && citiesData.length > 0) {
        onCityChange(citiesData[0].id);
      }
    } catch (err) {
      logger.error('Failed to load cities:', err);
      setError('Failed to load cities');
    } finally {
      setLoading(false);
    }
  }, [selectedCityId, includeAllCities, onCityChange]);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  const handleCityChange = (e) => {
    const value = e.target.value;
    if (value === 'all') {
      onCityChange(null);
      if (onIncludeAllCitiesChange) {
        onIncludeAllCitiesChange(true);
      }
    } else {
      onCityChange(parseInt(value));
      if (onIncludeAllCitiesChange) {
        onIncludeAllCitiesChange(false);
      }
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-sm text-gray-500">Loading cities...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <span className="text-sm text-red-500">{error}</span>
        <button 
          onClick={loadCities}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <label htmlFor="city-selector" className="text-sm font-medium text-gray-700">
        City:
      </label>
      <select
        id="city-selector"
        value={includeAllCities ? 'all' : (selectedCityId || '')}
        onChange={handleCityChange}
        className={`px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          includeAllCities 
            ? 'border-yellow-400 bg-yellow-50' 
            : 'border-gray-300 bg-white'
        }`}
      >
        {!selectedCityId && !includeAllCities && (
          <option value="" disabled>Select a city...</option>
        )}
        {allowAllCities && (
          <option value="all">🌐 All Cities (Cross-city access)</option>
        )}
        {cities.map(city => (
          <option key={city.id} value={city.id}>
            {city.name}{city.state ? `, ${city.state}` : ''}
          </option>
        ))}
      </select>
      
      {/* Visual indicator for cross-city mode */}
      {includeAllCities && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Cross-city mode
        </span>
      )}
    </div>
  );
};

export default CitySelector;
