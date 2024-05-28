import React, { useState , useEffect} from 'react';
import './switch.css'; // Create a CSS file for styling

const ToggleSwitch = ({operation , label}) => {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  useEffect(()=>{
    
    operation();

    

  }, [isOn])


  return (
    <div className="toggle-switch">
      <input
        type="checkbox"
        className="toggle-switch-checkbox"
        id="toggleSwitch"
        checked={isOn}
        onChange={handleToggle}
      />
      <label className="toggle-switch-label" htmlFor="toggleSwitch">
        <span className="toggle-switch-inner" />
        <span className="toggle-switch-switch" />
        {label}
      </label>
    </div>
  );
};

export default ToggleSwitch;