let currentScenario = 'optimal'; // global state for the exhibition

exports.setScenario = (req, res) => {
  const { scenario } = req.body;
  if (!['optimal', 'drought', 'pest'].includes(scenario)) {
    return res.status(400).json({ message: "Invalid scenario" });
  }
  currentScenario = scenario;
  res.json({ message: `Scenario switched to ${scenario}`, currentScenario });
};

exports.getScenario = () => currentScenario;
