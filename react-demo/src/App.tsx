import { useState } from 'react'
import KultripWidget from './KultripWidget'
import './App.css'

function App() {
  const [userId, setUserId] = useState('DEMO_AGENCY')
  const [language, setLanguage] = useState<'en' | 'es' | 'auto'>('auto')
  const [showWidget, setShowWidget] = useState(true)
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  const handleWidgetLoad = () => {
    setStatus('loaded')
    console.log('Kultrip widget loaded successfully!')
  }

  const handleWidgetError = (error: Error) => {
    setStatus('error')
    console.error('Kultrip widget error:', error)
  }

  const toggleWidget = () => {
    setShowWidget(!showWidget)
    setStatus('loading')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🌍 Kultrip Widget React Demo</h1>
        <p>Interactive demo of the Kultrip travel widget React component</p>
      </header>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="userId">Agency ID:</label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter agency ID"
          />
        </div>

        <div className="control-group">
          <label htmlFor="language">Language:</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'auto')}
          >
            <option value="auto">Auto-detect</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        <button onClick={toggleWidget} className="toggle-btn">
          {showWidget ? 'Hide Widget' : 'Show Widget'}
        </button>

        <div className={`status ${status}`}>
          Status: {status}
        </div>
      </div>

      <main className="main">
        {showWidget && (
          <div className="widget-section">
            <h2>Live Widget Preview</h2>
            <p>
              <strong>Configuration:</strong> Agency: {userId} | Language: {language}
            </p>
            
            <KultripWidget
              userId={userId}
              language={language}
              height={600}
              width="100%"
              onLoad={handleWidgetLoad}
              onError={handleWidgetError}
            />
          </div>
        )}

        <div className="info-section">
          <h2>Usage Examples</h2>
          
          <div className="code-block">
            <h3>Basic Usage</h3>
            <pre><code>{`import KultripWidget from './KultripWidget';

function MyPage() {
  return (
    <KultripWidget 
      userId="YOUR_AGENCY_ID"
    />
  );
}`}</code></pre>
          </div>

          <div className="code-block">
            <h3>With Custom Options</h3>
            <pre><code>{`<KultripWidget
  userId="MADRID_TRAVEL_001"
  language="es"
  height={500}
  width="80%"
  onLoad={() => console.log('Widget loaded!')}
  onError={(error) => console.error('Widget error:', error)}
/>`}</code></pre>
          </div>

          <div className="code-block">
            <h3>Multiple Widgets</h3>
            <pre><code>{`function TravelPage() {
  return (
    <div>
      <h2>Plan Your European Adventure</h2>
      <KultripWidget userId="EUROPE_TRAVEL" language="en" />
      
      <h2>Planifica Tu Aventura Latina</h2>
      <KultripWidget userId="LATIN_TRAVEL" language="es" />
    </div>
  );
}`}</code></pre>
          </div>
        </div>

        <div className="features-section">
          <h2>Component Features</h2>
          <ul>
            <li>✅ <strong>Dynamic Loading</strong>: Loads CSS/JS from CDN only when needed</li>
            <li>✅ <strong>Error Handling</strong>: Shows loading states and error messages</li>
            <li>✅ <strong>TypeScript</strong>: Full type safety and IntelliSense</li>
            <li>✅ <strong>Multiple Instances</strong>: Support multiple widgets on same page</li>
            <li>✅ <strong>Auto Cleanup</strong>: Proper component unmounting</li>
            <li>✅ <strong>Language Support</strong>: Auto-detect or force Spanish/English</li>
            <li>✅ <strong>Callbacks</strong>: onLoad and onError event handlers</li>
            <li>✅ <strong>Responsive</strong>: Configurable width and height</li>
          </ul>
        </div>
      </main>

      <footer className="footer">
        <p>
          🚀 <strong>Browser Language:</strong> {navigator.language} 
          | <strong>Detected:</strong> {navigator.language.startsWith('es') ? 'Spanish' : 'English'}
        </p>
        <p>
          Open browser DevTools → Console to see widget loading logs
        </p>
      </footer>
    </div>
  )
}

export default App