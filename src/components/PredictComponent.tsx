import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar componentes necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [formData, setFormData] = useState({
    NearbyBiomassSources: 10, // sin unidades
    FuelNeededByPlant: 150, // toneladas
    CO2Concentration: 30, // porcentaje (%)
    Humidity: 10, // porcentaje (%)
    Temperature: 25, // grados Celsius (°C)
    BiomassAvailability: true, // true (disponible) o false (no disponible)
    BiomassPricePerTon: 50, // dólares ($)
    BiomassTransport: 10, // kilómetros (km)
    OxyfuelPricePerTon: 70, // dólares ($)
    OxyfuelTransport: 15, // kilómetros (km)
    TraditionalPricePerTon: 90, // dólares ($)
    TraditionalTransport: 20, // kilómetros (km)
  });

  const [simulatedData, setSimulatedData] = useState({
    fuels: ['Biomass', 'Natural Gas', 'Coal'],
    methods: ['Membrane', 'Adsorption', 'Absorption'],
    fuelPercentages: [50, 30, 20],
    methodPercentages: [40, 35, 25],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'BiomassAvailability' ? value === 'true' : parseFloat(value),
    });
  };

  const updateSimulation = () => {
    // Actualiza los datos simulados
    setSimulatedData({
      fuels: simulatedData.fuels,
      methods: simulatedData.methods,
      fuelPercentages: [
        formData.BiomassAvailability ? 40 : 20,
        formData.BiomassAvailability ? 40 : 60,
        20,
      ],
      methodPercentages: [
        formData.Humidity,
        100 - formData.Humidity - 5,
        5,
      ],
    });
  };

  const dataBar = {
    labels: simulatedData.fuels,
    datasets: [
      {
        label: 'Predicted Fuel Distribution (%)',
        data: simulatedData.fuelPercentages,
        backgroundColor: ['#36a2eb', '#ff6384', '#ffce56'],
      },
    ],
  };

  const dataLine = {
    labels: simulatedData.methods,
    datasets: [
      {
        label: 'Predicted CO₂ Capture Methods (%)',
        data: simulatedData.methodPercentages,
        fill: false,
        borderColor: '#4bc0c0',
        pointBackgroundColor: '#4bc0c0',
        pointBorderColor: '#fff',
        pointRadius: 5,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Simulated Dashboard</h1>

      {/* Controles para parámetros de entrada */}
      <div className="mb-6 bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Adjust Simulation Inputs</h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.1, delayChildren: 0.1 },
            },
          }}
        >
          {Object.keys(formData).map((key) => (
            <motion.div
              key={key}
              className="space-y-2"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <label className="block text-sm font-medium">
                {key
                  .replace(/([A-Z])/g, ' $1')
                  .replace('Nearby Biomass Sources', 'Nearby Biomass Sources (Units)')
                  .replace('Fuel Needed By Plant', 'Fuel Needed By Plant (Tons)')
                  .replace('CO2 Concentration', 'CO₂ Concentration (%)')
                  .replace('Temperature', 'Temperature (°C)')
                  .replace('Humidity', 'Humidity (%)')
                  .replace('Price', 'Price ($)')
                  .replace('Transport', 'Transport (Km)')
                  .replace('Biomass Availability', 'Biomass Availability (Available/Not Available)')}
              </label>
              {key === 'BiomassAvailability' ? (
                <select
                  name={key}
                  value={formData[key as keyof typeof formData] ? 'true' : 'false'}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              ) : (
                <input
                  type="number"
                  name={key}
                  value={formData[key as keyof typeof formData]}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                />
              )}
            </motion.div>
          ))}
        </motion.div>
        <button
          onClick={updateSimulation}
          className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
        >
          Update Simulation
        </button>
      </div>

      {/* Visualización de gráficos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Fuel Prediction</h2>
          <Bar data={dataBar} />
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">CO₂ Capture Method</h2>
          <Line data={dataLine} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
