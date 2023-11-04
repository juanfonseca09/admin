import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { Productos } from './Productos';
import { Ordenes } from './Ordenes';
import { Cargar } from './Cargar';



export const MyRoutes = () => {
  return (
    
        <Routes>
            <Route path='/' element={<Navigate to="/ordenes"/>} />
            <Route path='/ordenes' element={<Ordenes/>} />
            <Route path='/cargar' element={<Cargar/>} />
            <Route path='/productos' element={<Productos />} />  
              
        </Routes>
    
  )
}
