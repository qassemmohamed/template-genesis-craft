
export const Logo = () => (
  <div className="flex items-center space-x-2">
    <div className="h-8 w-8 rounded-md bg-button flex items-center justify-center text-button-text">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <path d="m7.5 4.21 4.5 2.6 4.5-2.6"></path>
        <path d="M7.5 19.79V14.6L3 12"></path>
        <path d="M21 12 16.5 14.6v5.19"></path>
        <path d="M3.27 6.96 12 12.01l8.73-5.05"></path>
        <path d="M12 22.08V12"></path>
      </svg>
    </div>
    <div className="font-semibold text-xl text-foreground">Template Generator</div>
  </div>
);
