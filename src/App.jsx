import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

// For development purposes, set a base URL for the backend
const API_BASE_URL = "http://localhost:3001";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 text-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <header className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-center text-indigo-700">Animal Facts</h1>
        </header>
        {children}
      </div>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Welcome to Animal Facts!</h1>
      <p className="mb-6 text-gray-700 text-center">This site fetches random cat and dog facts using external APIs. You can also save your favorites!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100 text-center hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">Dog Facts</h2>
          <p className="text-gray-600 mb-4">Discover interesting facts about dogs</p>
          <Link to="/dog-facts" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            View Dog Facts
          </Link>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg shadow-md border border-purple-100 text-center hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">Cat Facts</h2>
          <p className="text-gray-600 mb-4">Learn fascinating facts about cats</p>
          <Link to="/cat-facts" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            View Cat Facts
          </Link>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <Link to="/saved" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
          View Saved Facts
        </Link>
      </div>
    </div>
  );
}

function DogFacts() {
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reliable dog facts for local development
  const dogFacts = [
    "Dogs have three eyelids. The third lid, called a nictitating membrane or 'haw,' keeps the eye lubricated and protected.",
    "A dog's nose print is unique, similar to a person's fingerprint.",
    "Dalmatians are born completely white, and develop their spots as they grow older.",
    "Dogs' sense of smell is about 40 times better than humans.",
    "Greyhounds can reach speeds of up to 45 miles per hour.",
    "The Basenji is the only breed of dog that cannot bark.",
    "A dog's average body temperature is 101.2 degrees Fahrenheit.",
    "The Labrador Retriever has been the most popular dog breed in the United States for over 30 years.",
    "Dogs have about 1,700 taste buds. Humans have approximately 9,000.",
    "Dogs curl up in a ball when sleeping to protect their organs—a holdover from their days in the wild."
  ];

  const fetchFact = async () => {
    setLoading(true);
    setError("");
    try {
      // First try the API
      const response = await axios.get("https://dog-api.kinduff.com/api/facts");
      if (response.data && response.data.facts && response.data.facts.length > 0) {
        setFact(response.data.facts[0]);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      console.error("Error fetching dog fact:", error);
      // Use our local facts as a fallback
      setFact(dogFacts[Math.floor(Math.random() * dogFacts.length)]);
    } finally {
      setLoading(false);
    }
  };

  const saveFact = async () => {
    if (!fact) return;
    
    try {
      // Make sure we're sending to our local API
      await axios.post(`${API_BASE_URL}/api/facts`, { fact, animal: "dog" });
      alert("Fact saved successfully!");
    } catch (err) {
      console.error("Error saving fact:", err);
      alert(`Failed to save fact: ${err.message}. Make sure your backend server is running at ${API_BASE_URL}.`);
    }
  };

  useEffect(() => {
    fetchFact();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-800">Random Dog Fact</h1>
      
      <div className="min-h-[120px] bg-blue-50 p-4 rounded-lg shadow-inner border border-blue-100 flex items-center justify-center mb-6">
        {loading ? (
          <p className="text-sm italic text-gray-500">Fetching a fascinating dog fact...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <p className="my-4 text-lg text-gray-700">{fact}</p>
        )}
      </div>
      
      <div className="flex gap-3 justify-center">
        <button 
          onClick={fetchFact} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          New Fact
        </button>
        <button 
          onClick={saveFact} 
          disabled={!fact || loading}
          className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm ${(!fact || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Save Fact
        </button>
      </div>
      
      <Link to="/" className="text-blue-600 underline mt-6 block text-center hover:text-blue-800 transition-colors">
        Back to Home
      </Link>
    </div>
  );
}

function CatFacts() {
  const [fact, setFact] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reliable cat facts for local development
  const catFacts = [
    "Cats make about 100 different sounds. Dogs make only about 10.",
    "A cat's brain is biologically more similar to a human brain than it is to a dog's.",
    "Cats have over 20 muscles that control their ears.",
    "Cats sleep 70% of their lives.",
    "Cats can jump up to six times their length.",
    "A house cat's genome is 95.6% tiger.",
    "Cats are believed to be the only mammals who don't taste sweetness.",
    "Cats have an extra organ that allows them to taste scents in the air.",
    "Adult cats only meow to communicate with humans, not other cats.",
    "A cat's purr vibrates at a frequency of 25 to 150 hertz, which can promote healing."
  ];

  const getFact = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://catfact.ninja/fact");
      if (res.data && res.data.fact) {
        setFact(res.data.fact);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (error) {
      console.error("Error fetching cat fact:", error);
      // Use our local facts as a fallback
      setFact(catFacts[Math.floor(Math.random() * catFacts.length)]);
    } finally {
      setLoading(false);
    }
  };

  const saveFact = async () => {
    if (!fact) return;
    
    try {
      await axios.post(`${API_BASE_URL}/api/facts`, { fact, animal: "cat" });
      alert("Fact saved successfully!");
    } catch (err) {
      console.error("Error saving fact:", err);
      alert(`Failed to save fact: ${err.message}. Make sure your backend server is running at ${API_BASE_URL}.`);
    }
  };

  useEffect(() => {
    getFact();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center text-purple-800">Random Cat Fact</h1>
      
      <div className="min-h-[120px] bg-purple-50 p-4 rounded-lg shadow-inner border border-purple-100 flex items-center justify-center mb-6">
        {loading ? (
          <p className="text-sm italic text-gray-500">Fetching a fascinating cat fact...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <p className="my-4 text-lg text-gray-700">{fact}</p>
        )}
      </div>
      
      <div className="flex gap-3 justify-center">
        <button 
          onClick={getFact} 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          New Fact
        </button>
        <button 
          onClick={saveFact}
          disabled={!fact || loading}
          className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm ${(!fact || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Save Fact
        </button>
      </div>
      
      <Link to="/" className="text-purple-600 underline mt-6 block text-center hover:text-purple-800 transition-colors">
        Back to Home
      </Link>
    </div>
  );
}

function SavedFacts() {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const deleteFact = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/facts/${id}`);
      // Update the UI by removing the deleted fact
      setFacts(facts.filter(fact => fact._id !== id));
      alert("Fact deleted successfully!");
    } catch (err) {
      console.error("Error deleting fact:", err);
      alert(`Failed to delete fact: ${err.message}. Make sure your backend server is running at ${API_BASE_URL}.`);
    }
  };

  useEffect(() => {
    const fetchFacts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_BASE_URL}/api/facts`);
        if (Array.isArray(res.data)) {
          setFacts(res.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching saved facts:", error);
        // If there's a connection error, create mock data for demonstration
        if (error.code === "ERR_NETWORK") {
          setError(`Network error: Can't connect to backend server at ${API_BASE_URL}. Please ensure your backend server is running.`);
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFacts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center text-green-800">Your Saved Facts</h1>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <p className="text-gray-500 italic">Loading your saved facts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-700 text-center mb-4">
          {error}
        </div>
      ) : facts.length === 0 ? (
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100 text-center">
          <p className="text-gray-700 mb-2">You haven't saved any facts yet.</p>
          <p className="text-gray-600">Visit the Cat Facts or Dog Facts pages to find and save some interesting facts!</p>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {facts.map((fact, i) => (
            <div key={i} className={`p-4 rounded-lg shadow-sm border ${
              fact.animal === 'dog' ? 'bg-blue-50 border-blue-100' : 'bg-purple-50 border-purple-100'
            }`}>
              <div className="flex justify-between items-start">
                <p className="text-gray-700">{fact.fact || fact}</p>
                {fact._id && (
                  <button 
                    onClick={() => deleteFact(fact._id)}
                    className="ml-3 text-red-500 hover:text-red-700 text-sm"
                    title="Delete fact"
                  >
                    ×
                  </button>
                )}
              </div>
              {fact.animal && (
                <span className={`text-xs mt-2 inline-block px-2 py-1 rounded-full ${
                  fact.animal === 'dog' ? 'bg-blue-200 text-blue-800' : 'bg-purple-200 text-purple-800'
                }`}>
                  {fact.animal === 'dog' ? 'Dog' : 'Cat'} fact
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      
      <Link to="/" className="text-green-600 underline mt-6 block text-center hover:text-green-800 transition-colors">
        Back to Home
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/dog-facts" element={<Layout><DogFacts /></Layout>} />
        <Route path="/cat-facts" element={<Layout><CatFacts /></Layout>} />
        <Route path="/saved" element={<Layout><SavedFacts /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;