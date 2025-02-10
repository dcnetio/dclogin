"use client";
import { useEffect } from 'react';
import VConsole from 'vconsole';
export default function VConsoleEl({children}: { children: React.ReactNode }) {
  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') {
      let vConsole: VConsole;
      // const loadVConsole = async () => {
      //   const VConsole = (await import('vconsole')).default;
      //   vConsole = new VConsole();
      // };
      // loadVConsole();
      return () => {
        if (vConsole) vConsole.destroy();
      };
    // }
  }, []);
 
  return (
    <div>
      {children}
    </div>
  );
}