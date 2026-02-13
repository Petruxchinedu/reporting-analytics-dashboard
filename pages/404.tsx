import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '4rem', margin: 0, color: '#319795' }}>404</h1>
      <p style={{ fontSize: '1.25rem', color: '#718096' }}>Page Not Found</p>
      <button 
        onClick={() => router.push('/')}
        style={{
          padding: '0.75rem 2rem',
          backgroundColor: '#319795',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Go Home
      </button>
    </div>
  );
}