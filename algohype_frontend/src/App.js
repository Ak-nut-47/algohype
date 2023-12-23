import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [showUrlError, setShowUrlError] = useState(false);
  const [showHeightError, setShowHeightError] = useState(false);
  const [showWidthError, setShowWidthError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allScreenshots, setAllScreenshots] = useState({});

  const handleButtonClick = async () => {
    // Reset error states
    setShowUrlError(false);
    setShowHeightError(false);
    setShowWidthError(false);

    if (!url) {
      // Show URL error
      setShowUrlError(true);
    }

    if (!height || height < 240) {
      // Show height error
      setShowHeightError(true);
    }

    if (!width || width < 240) {
      // Show width error
      setShowWidthError(true);
    }

    if (url && height && width && height >= 240 && width >= 240) {
      try {
        // Set loading state
        setLoading(true);

        // Perform the POST request to the server
        const response = await fetch('http://localhost:3001/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url, height, width }),
        });

        if (response.ok) {
          const data = await response.json();
          setAllScreenshots(data.screenshots);
        } else {
          console.error('Server error:', response.status);
        }
      } catch (error) {
        console.error('Error:', error.message);
      } finally {
        // Reset loading state
        setLoading(false);
      }
    }
  };

  const clearInputs = () => {
    setUrl('');
    setHeight('');
    setWidth('');
  };

  return (
    <>
      <div className="App" style={{ textAlign: 'center', padding: '20px', backgroundColor: 'olivegreen', color: 'maroon', boxShadow: '0 0 10px olivegreen' }}>
        <h1>Website Screenshot Generator</h1>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px' }}>Input url of website to take screenshot:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            style={{ padding: '5px', width: '300px' }}
            required
            disabled={loading}
          />
          {showUrlError && <div style={{ color: 'red', marginTop: '5px' }}>Please provide a valid URL.</div>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px' }}>Height (px):</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={{ padding: '5px', width: '100px' }}
            required
            disabled={loading}
          />
          {showHeightError && <div style={{ color: 'red', marginTop: '5px' }}>Input height should be greater than or equal to 240px.</div>}
          <label style={{ marginLeft: '20px', marginRight: '10px' }}>Width (px):</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            style={{ padding: '5px', width: '100px' }}
            required
            disabled={loading}
          />
          {showWidthError && <div style={{ color: 'red', marginTop: '5px' }}>Input width should be greater than or equal to 240px.</div>}
        </div>

        <button
          onClick={handleButtonClick}
          style={{ padding: '10px', backgroundColor: 'maroon', color: 'olivegreen', border: 'none', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
          disabled={loading}
        >
          {loading ? 'Capturing Screenshots, please wait...' : 'Generate Screenshot'}
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Capturing Screenshots of the site, please wait...</p>

        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
        {Object.keys(allScreenshots).map((key) => (
          <div key={key} style={{ padding: '10px', marginBottom: '20px', flex: '0 0 calc(80% - 20px)' }}>
            <img

              src={`data:image/png;base64,${allScreenshots[key]}`}
              alt={`Image at ${key}`}
              style={{ maxWidth: '80%', objectFit: 'contain', border: '2px solid maroon' }}
            />
          </div>
        ))}
      </div >
    </>
  );
}

export default App;
