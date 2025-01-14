import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // Usa useNavigate

const MobilitaTest = () => {
  const navigate = useNavigate(); // Usa useNavigate per la navigazione

  const cards = [
    {
      id: 1,
      title: "Flessione Spallla",
      image:
        "https://i.ibb.co/kDN2fqR/ecfba699-dde5-4e64-8275-56633873be66.jpg",
      description:
        "Test per valutare la mobilità della spalla sinistra in flessione.",
      route: "/shoulder-flexion",
    },

    {
      id: 2,
      title: "Estensione Spalla ",
      image:
        "https://i.ibb.co/Vtkg4mZ/DALL-E-2024-12-11-13-18-56-A-cartoon-style-illustration-of-a-patient-at-home-performing-a-shoulder-e.webp",
      description:
        "Test per valutare la mobilità della spalla sinistra in estensione.",
      route: "/shoulder-extension",
    },
 
    {
      id: 3,
      title: "Flessione Anca",
      image:
        "https://i.ibb.co/Vtkg4mZ/DALL-E-2024-12-11-13-18-56-A-cartoon-style-illustration-of-a-patient-at-home-performing-a-shoulder-e.webp",
      description:
        "Test per valutare la mobilità della spalla destra in estensione.",
      route: "/hip-flexion",
    },

    {
      id: 4,
      title: "Estensione Anca ",
      image:
        "https://i.ibb.co/Vtkg4mZ/DALL-E-2024-12-11-13-18-56-A-cartoon-style-illustration-of-a-patient-at-home-performing-a-shoulder-e.webp",
      description:
        "Test per valutare la mobilità della spalla destra in estensione.",
      route: "/hip-extension",
    },
    {
      id: 5,
      title: "Flessione Ginocchio",
      image:
        "https://i.ibb.co/Vtkg4mZ/DALL-E-2024-12-11-13-18-56-A-cartoon-style-illustration-of-a-patient-at-home-performing-a-shoulder-e.webp",
      description:
        "Test per valutare la mobilità della spalla destra in estensione.",
      route: "/knee-flexion",
    },
    {
      id: 6,
      title: "Estensione Ginocchio",
      image:
        "https://i.ibb.co/Vtkg4mZ/DALL-E-2024-12-11-13-18-56-A-cartoon-style-illustration-of-a-patient-at-home-performing-a-shoulder-e.webp",
      description:
        "Test per valutare la mobilità della spalla destra in estensione.",
      route: "/knee-extension",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-blue-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)} // Usa navigate(-1) per tornare indietro
          className="bg-transparent text-blue-600 hover:text-blue-800 text-lg font-semibold mb-6 focus:outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          &#8592; Torna indietro
        </motion.button>

        {/* Titolo e sottotitolo migliorati */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-extrabold text-gray-800 mb-3"
          >
            Test di Mobilità Articolare
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-600 mb-8"
          >
            Un test di mobilità articolare serve per valutare il range di
            movimento (ROM) di una articolazione, ossia quanto una parte del
            corpo può muoversi senza dolore. Scopri la tua flessibilità e
            monitora il progresso con questi esercizi mirati.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Link key={card.id} to={card.route}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none"
                tabIndex={0}
                role="button"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    console.log(`${card.title} test selected`);
                  }
                }}
                onClick={() => console.log(`${card.title} test selected`)}
              >
                {/* Contenitore immagine proporzionato a 16:9 */}
                <div className="w-full aspect-w-16 aspect-h-9">
                  <img
                    src={card.image}
                    alt={`${card.title} illustration`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/800x450?text=Image+Not+Found";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobilitaTest;
