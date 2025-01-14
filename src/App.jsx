// App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css"; // O il percorso corretto del tuo file CSS
import HomePage from "./Pages/HomePage";
import MobilitaTest from "./Pages/MobilitaTest";
import ExerciseTest from "./Pages/ExerciseTest";
import Report from "./Components/Report";
import StrengthEvaluation from "./Pages/StrengthEvaluation";
import ReportExercise from "./Components/ReportExercise";
import KneeFlexion from "./Pages/exercise/KneeFlexion/KneeFlexion";
import ShoulderFlexion from "./Pages/mobility-test/ShoulderFlexion/ShoulderFlexion";
import ShoulderExtension from "./Pages/mobility-test/ShoulderExtension/ShoulderExtension";
import Squat from "./Pages/exercise/Squat/Squat";
import BicepCurl from "./Pages/exercise/BicepCurl/BicepCurl";
import HipFlexion from "./Pages/mobility-test/HipFlexion/HipFlexion";
import HipExtension from "./Pages/mobility-test/HipExtension/HipExtension";
import KneeFlexionMobility from "./Pages/mobility-test/KneeFlexionMobility/KneeFlexionMobility";
import KneeExtension from "./Pages/mobility-test/KneeExtension/KneeExtension";
import Debug from "./Pages/debug-component/Debug";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mobility-test" element={<MobilitaTest />} />
        <Route path="/exercise-test" element={<ExerciseTest />} />
        <Route path="/strength-evaluation" element={<StrengthEvaluation />} />
        <Route
          path="/shoulder-flexion"
          element={<ShoulderFlexion  />}
        />
        <Route
          path="/shoulder-extension"
          element={<ShoulderExtension  />}
        />
        <Route path="/knee-flexion" element={<KneeFlexionMobility />} />
        <Route path="/knee-extension" element={<KneeExtension/>} />
        <Route path="/knee-left" element={<KneeFlexion side="left" />} />
        <Route path="/knee-right" element={<KneeFlexion side="right" />} />
        <Route path="/report" element={<Report />} />
        <Route path="/report-exercise" element={<ReportExercise />} />
        <Route path="/squat-left" element={<Squat side="left" />} />
        <Route path="/squat-right" element={<Squat side="right" />} />
        <Route path="/bicep-curl-right" element={<BicepCurl side="right" />} />
        <Route path="/bicep-curl-left" element={<BicepCurl side="left" />} />
        <Route path="/hip-flexion" element={<HipFlexion  />} />
        <Route
          path="/hip-extension"
          element={<HipExtension />}
        />
        <Route path="/debug" element={<Debug />} />

      </Routes>
    </Router>
  );
}

export default App;
