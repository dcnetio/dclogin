"use client";
import { useEffect } from 'react';
import './iframe.js';
export default function Iframe() {
  useEffect(() => {
    // const script = document.createElement('script');
    // script.src = './iframe.js'; // 假设iframe.js位于public/iframe.js
    // script.async = true;
 
    // document.head.appendChild(script);
 
    // 清理函数，组件卸载时移除<script>标签
    return () => {
      // document.head.removeChild(script);
    };
  }, []);
 
  return (
    <div>111
      {/* 你的组件内容 */}
    </div>
  );
}