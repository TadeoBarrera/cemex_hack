import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const PredictionComponent: React.FC = () => {
  const [formData, setFormData] = useState({
    // Valores iniciales para las entradas
    nearbyBiomassSources: 10,
    fuelNeededByPlant: 150,
    co2Concentration: 30,
    humidity: 10,
    temperature: 25,
    bmAvailability: 1, // Biomass availability (1 = disponible, 0 = no disponible)
    bmPricePerTon: 50,
    bmTransport: 10,
    ofPricePerTon: 70,
    ofTransport: 15,
    tradPricePerTon: 90,
    tradTransport: 20,
  });

  const [prediction, setPrediction] = useState({
    fuel: '',
    co2CaptureMethod: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value),
    });
  };

  const handlePredict = async () => {
    try {
      // Cargar modelos
      const fuelModel = await tf.loadLayersModel('../../public/models/tfjs_models_fuel/model.json');
      const captureModel = await tf.loadLayersModel('../../public/models/tfjs_model_capture/model.json');

      // Crear el tensor de entrada
      const inputTensor = tf.tensor2d([[
        formData.nearbyBiomassSources / 20, // Normalización
        formData.fuelNeededByPlant / 200,
        formData.co2Concentration / 50,
        formData.humidity / 100,
        formData.temperature / 50,
        formData.bmAvailability,
        formData.bmPricePerTon / 100,
        formData.bmTransport / 50,
        formData.ofPricePerTon / 100,
        formData.ofTransport / 50,
        formData.tradPricePerTon / 100,
        formData.tradTransport / 50,
      ]]);

      // Predicciones
      const fuelPrediction = fuelModel.predict(inputTensor) as tf.Tensor;
      const capturePrediction = captureModel.predict(inputTensor) as tf.Tensor;

      // Interpretar resultados
      const fuelClasses = ['Biomass', 'Natural Gas', 'Coal'];
      const co2CaptureMethods = ['Membrane', 'Adsorption', 'Absorption'];

      const bestFuelIndex = fuelPrediction.argMax(-1).dataSync()[0];
      const bestCaptureMethodIndex = capturePrediction.argMax(-1).dataSync()[0];

      setPrediction({
        fuel: fuelClasses[bestFuelIndex],
        co2CaptureMethod: co2CaptureMethods[bestCaptureMethodIndex],
      });
    } catch (error) {
      console.error('Error al realizar la predicción:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Predicción de Combustible y Captura de CO₂</h1>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{key.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type="number"
              name={key}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handlePredict}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Predecir
      </button>

      {prediction.fuel && (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Resultados</h2>
          <p>
            <strong>Mejor Combustible:</strong> {prediction.fuel}
          </p>
          <p>
            <strong>Mejor Método de Captura de CO₂:</strong> {prediction.co2CaptureMethod}
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionComponent;
