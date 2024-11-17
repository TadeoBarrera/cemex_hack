import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Line, Pie, Radar, PolarArea, Bubble, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
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
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [formData, setFormData] = useState({
    NearbyBiomassSources: 10,
    FuelNeededByPlant: 150,
    CO2Concentration: 30,
    Humidity: 10,
    Temperature: 25,
    BiomassAvailability: true,
    BiomassPricePerTon: 50,
    BiomassTransport: 10,
    OxyfuelPricePerTon: 70,
    OxyfuelTransport: 15,
    TraditionalPricePerTon: 90,
    TraditionalTransport: 20,
  });

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showGraphs, setShowGraphs] = useState(false); // Controlar la visibilidad de las gráficas

  const [simulatedData, setSimulatedData] = useState({
    fuels: ['Biomass', 'Natural Gas', 'Coal'],
    methods: ['Membrane', 'Adsorption', 'Absorption'],
    fuelPercentages: [50, 30, 20],
    methodPercentages: [40, 35, 25],
    temperatureImpact: [formData.Temperature * 0.5, formData.Temperature * 0.3, formData.Temperature * 0.2],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'BiomassAvailability' ? value === 'true' : parseFloat(value),
    });
  };

  const updateSimulation = () => {
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
      temperatureImpact: [
        formData.Temperature * 0.5,
        formData.Temperature * 0.3,
        formData.Temperature * 0.2,
      ],
    });
    setShowGraphs(true);
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

  const dataPie = {
    labels: simulatedData.fuels,
    datasets: [
      {
        label: 'Fuel Distribution',
        data: simulatedData.fuelPercentages,
        backgroundColor: ['#36a2eb', '#ff6384', '#ffce56'],
      },
    ],
  };

  const dataRadar = {
    labels: simulatedData.fuels,
    datasets: [
      {
        label: 'Temperature Impact on Fuels',
        data: simulatedData.temperatureImpact,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  const dataPolar = {
    labels: simulatedData.fuels,
    datasets: [
      {
        label: 'Fuel Polar Distribution',
        data: simulatedData.fuelPercentages,
        backgroundColor: ['#36a2eb', '#ff6384', '#ffce56'],
      },
    ],
  };

  const dataScatter = {
    datasets: [
      {
        label: 'CO₂ Scatter',
        data: simulatedData.fuelPercentages.map((p, i) => ({
          x: i + 1,
          y: p,
        })),
        backgroundColor: '#4bc0c0',
      },
    ],
  };

  const dataBubble = {
    datasets: [
      {
        label: 'Fuel Bubble',
        data: simulatedData.fuelPercentages.map((p, i) => ({
          x: i + 1,
          y: p,
          r: p / 5,
        })),
        backgroundColor: '#ff6384',
      },
    ],
  };

  const optionsRadar = {
    plugins: {
      tooltip: {
        enabled: false, // Deshabilita los tooltips
      },
      legend: {
        display: false, // Oculta la leyenda si no es necesaria
      },
    },
    scales: {
      r: {
        ticks: {
          display: false, // Oculta los números en los ejes del radar
        },
        grid: {
          color: '#444', // Ajusta el color de las líneas del radar si es necesario
        },
      },
    },
  };
  
  const optionsPolar = {
    plugins: {
      tooltip: {
        enabled: false, // Deshabilita los tooltips
      },
      legend: {
        display: true, // Muestra u oculta la leyenda
      },
    },
    scales: {
      r: {
        ticks: {
          display: false, // Oculta los números en los ejes de la gráfica polar
        },
      },
    },
  };
  

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
      }}
      className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
    >
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
        Smart Analytics Hub
        </h1>
        <select
          value={isDarkMode ? 'dark' : 'light'}
          onChange={(e) => setIsDarkMode(e.target.value === 'dark')}
          className={`px-4 py-2 rounded border ${
            isDarkMode
              ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'
              : 'bg-gray-200 text-black border-gray-400 hover:bg-gray-300'
          }`}
        >
          <option value="dark">Dark Mode</option>
          <option value="light">Light Mode</option>
        </select>
      </header>

      <motion.div
        whileInView={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.5 }}
        className={`mb-6 p-4 rounded shadow ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
      >
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
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              {key === 'BiomassAvailability' ? (
                <select
                  name={key}
                  value={formData[key as keyof typeof formData] ? 'true' : 'false'}
                  onChange={handleInputChange}
                  className={`w-full rounded p-2 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-300 text-black border-gray-400'}`}
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              ) : (
                <input
                  type="number"
                  name={key}
                  // @ts-ignore
                  value={formData[key as keyof typeof formData]}
                  onChange={handleInputChange}
                  className={`w-full rounded p-2 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-300 text-black border-gray-400'}`}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
        <button
          onClick={updateSimulation}
          className={`px-4 py-2 mt-4 rounded ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-400 hover:bg-blue-500 text-black'}`}
        >
          Update Simulation
        </button>
      </motion.div>

      {showGraphs && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
  whileInView={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 50 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true, amount: 0.5 }}
  className={`p-4 rounded shadow ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
>
  <h2 className="text-xl font-semibold mb-4">Biomass Fuel Distribution</h2>
  <Bar data={dataBar} />
</motion.div>

<motion.div
  whileInView={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 50 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true, amount: 0.5 }}
  className={`p-4 rounded shadow ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
>
  <h2 className="text-xl font-semibold mb-4">CO₂ Capture Efficiency</h2>
  <Line data={dataLine} />
</motion.div>

<motion.div
  whileInView={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 50 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true, amount: 0.5 }}
  className={`p-4 rounded shadow ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
>
  <h2 className="text-xl font-semibold mb-4">Fuel Type Distribution</h2>
  <Pie data={dataPie} />
</motion.div>

<motion.div
  whileInView={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 50 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true, amount: 0.5 }}
  className={`p-4 rounded shadow ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
>
  <h2 className="text-xl font-semibold mb-4">Temperature Impact Analysis</h2>
  <Radar data={dataRadar} options={optionsRadar} />
</motion.div>

<motion.div
  whileInView={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 50 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true, amount: 0.5 }}
  className={`p-4 rounded shadow ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
>
  <h2 className="text-xl font-semibold mb-4">Fuel Availability (Polar Area)</h2>
  <PolarArea data={dataPolar} options={optionsPolar} />
</motion.div>

<motion.div
  whileInView={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 50 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true, amount: 0.5 }}
  className={`p-4 rounded shadow ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
>
  <h2 className="text-xl font-semibold mb-4">CO₂ Emissions Scatter</h2>
  <Scatter data={dataScatter} />
</motion.div>

<motion.div
  whileInView={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 50 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true, amount: 0.5 }}
  className={`p-4 rounded shadow ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
>
  <h2 className="text-xl font-semibold mb-4">Fuel Utilization Bubble Chart</h2>
  <Bubble data={dataBubble} />
</motion.div>

<motion.div
  whileInView={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 50 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true, amount: 0.5 }}
  className={`p-4 rounded shadow ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
>
  <h2 className="text-xl font-semibold mb-4">Integrated Fuel Distribution</h2>
  <Bar data={dataBar} />
</motion.div>

<motion.div
  whileInView={{ opacity: 1, y: 0 }}
  initial={{ opacity: 0, y: 50 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true, amount: 0.5 }}
  className={`p-4 rounded shadow ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
>
  <h2 className="text-xl font-semibold mb-4">Fuel Usage Over Time</h2>
  <Line data={dataLine} />
</motion.div>

      </div>
      )}
    </motion.div>
  );
};

export default Dashboard;

