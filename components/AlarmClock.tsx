
import React, { useState, useEffect, useMemo } from 'react';
import type { Alarm } from '../types';
import { useAudio } from '../hooks/useAudio';
import { Icon } from './Icon';

const ALARM_SOUND_URL = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';

export const AlarmClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState('07:30');
  const [newAlarmName, setNewAlarmName] = useState('');
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);

  const { play, stop } = useAudio(ALARM_SOUND_URL);

  useEffect(() => {
    try {
      const storedAlarms = localStorage.getItem('alarms');
      if (storedAlarms) {
        setAlarms(JSON.parse(storedAlarms));
      }
    } catch (error) {
      console.error("Failed to load alarms from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('alarms', JSON.stringify(alarms));
    } catch (error) {
      console.error("Failed to save alarms to localStorage", error);
    }
  }, [alarms]);

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (!ringingAlarm) {
        const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const triggeredAlarm = alarms.find(alarm => alarm.enabled && alarm.time === currentHHMM);
        
        if (triggeredAlarm) {
          setRingingAlarm(triggeredAlarm);
          play();
        }
      }
    }, 1000);

    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarms, play, ringingAlarm]);

  const formattedTime = useMemo(() => currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), [currentTime]);
  const formattedDate = useMemo(() => currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), [currentTime]);

  const handleAddAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlarm: Alarm = {
      id: Date.now(),
      time: newAlarmTime,
      name: newAlarmName || 'Alarm',
      enabled: true,
    };
    setAlarms(prev => [...prev, newAlarm].sort((a, b) => a.time.localeCompare(b.time)));
    setNewAlarmName('');
  };

  const handleToggleAlarm = (id: number) => {
    setAlarms(prev =>
      prev.map(alarm =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };
  
  const handleDeleteAlarm = (id: number) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const dismissAlarm = () => {
    if (ringingAlarm) {
      handleToggleAlarm(ringingAlarm.id);
    }
    stop();
    setRingingAlarm(null);
  };
  
  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {ringingAlarm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 text-center shadow-2xl animate-pulse">
            <Icon name="alarm" className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold">{ringingAlarm.name}</h2>
            <p className="text-5xl my-4">{ringingAlarm.time}</p>
            <button onClick={dismissAlarm} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg">
              Dismiss
            </button>
          </div>
        </div>
      )}
      
      <div className="text-center mb-6 p-6 bg-gray-900/50 rounded-lg">
        <h1 className="text-6xl md:text-8xl font-mono font-bold tracking-widest">{formattedTime}</h1>
        <p className="text-gray-400 mt-2">{formattedDate}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-3 border-b border-gray-600 pb-2">Add Alarm</h2>
          <form onSubmit={handleAddAlarm} className="space-y-3 bg-gray-700/50 p-4 rounded-lg">
            <input type="time" value={newAlarmTime} onChange={e => setNewAlarmTime(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
            <input type="text" value={newAlarmName} onChange={e => setNewAlarmName(e.target.value)} placeholder="Alarm name" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <Icon name="plus" className="w-5 h-5" />
              <span>Set Alarm</span>
            </button>
          </form>
        </div>
        
        <div className="flex-1">
            <h2 className="text-xl font-semibold mb-3 border-b border-gray-600 pb-2">Alarms</h2>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                 {alarms.length === 0 && <p className="text-center text-gray-400 mt-8">No alarms set.</p>}
                 {alarms.map(alarm => (
                    <li key={alarm.id} className={`flex items-center p-3 rounded-lg ${alarm.enabled ? 'bg-gray-700' : 'bg-gray-700/50'}`}>
                        <div className="flex-grow">
                            <p className={`text-2xl font-mono ${alarm.enabled ? 'text-white' : 'text-gray-500'}`}>{alarm.time}</p>
                            <p className={`text-sm ${alarm.enabled ? 'text-gray-300' : 'text-gray-500'}`}>{alarm.name}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer mx-4">
                          <input type="checkbox" checked={alarm.enabled} onChange={() => handleToggleAlarm(alarm.id)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                        <button onClick={() => handleDeleteAlarm(alarm.id)} className="text-gray-500 hover:text-red-500 p-1 rounded-full">
                           <Icon name="trash" className="w-5 h-5" />
                        </button>
                    </li>
                 ))}
            </ul>
        </div>
      </div>
    </div>
  );
};
