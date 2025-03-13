'use client';

import React from 'react';
import { TechPreferencesSectionProps } from './types';

export default function TechPreferencesSection({ 
  data, 
  updateData 
}: TechPreferencesSectionProps) {

  const handleChange = (key: string, value: string | string[]) => {
    console.log(`Actualizando preferencia tecnológica ${key}:`, value); // Debug
    updateData({
      ...data,
      [key]: value
    });
  };

  const handleFrameworkToggle = (framework: string) => {
    const currentFrameworks = data.frameworks || [];
    const updatedFrameworks = currentFrameworks.includes(framework)
      ? currentFrameworks.filter((f: string) => f !== framework)
      : [...currentFrameworks, framework];
    
    handleChange('frameworks', updatedFrameworks);
  };

  const handleDatabaseToggle = (database: string) => {
    const currentDatabases = data.databases || [];
    const updatedDatabases = currentDatabases.includes(database)
      ? currentDatabases.filter((d: string) => d !== database)
      : [...currentDatabases, database];
    
    handleChange('databases', updatedDatabases);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Preferencias Tecnológicas</h3>
      <p className="text-sm text-base-content/70 mb-4">
        Selecciona las tecnologías que prefieres o que son requisitos para tu sistema.
        Esto nos ayudará a generar un diagrama más ajustado a tus necesidades.
      </p>

      {/* Backend */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Lenguaje Backend Principal</span>
        </label>
        <select 
          className="select select-bordered w-full"
          value={data.backendLanguage}
          onChange={(e) => handleChange('backendLanguage', e.target.value)}
        >
          <option value="node">Node.js / JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C# / .NET</option>
          <option value="php">PHP</option>
          <option value="go">Go</option>
          <option value="ruby">Ruby</option>
          <option value="rust">Rust</option>
          <option value="any">Sin preferencia</option>
        </select>
      </div>

      {/* Frameworks */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Frameworks/Librerías</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={data.frameworks?.includes('react') || false}
                onChange={() => handleFrameworkToggle('react')}
              />
              <span className="label-text">React</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={data.frameworks?.includes('angular') || false}
                onChange={() => handleFrameworkToggle('angular')}
              />
              <span className="label-text">Angular</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={data.frameworks?.includes('vue') || false}
                onChange={() => handleFrameworkToggle('vue')}
              />
              <span className="label-text">Vue.js</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={data.frameworks?.includes('next') || false}
                onChange={() => handleFrameworkToggle('next')}
              />
              <span className="label-text">Next.js</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={data.frameworks?.includes('django') || false}
                onChange={() => handleFrameworkToggle('django')}
              />
              <span className="label-text">Django</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={data.frameworks?.includes('spring') || false}
                onChange={() => handleFrameworkToggle('spring')}
              />
              <span className="label-text">Spring</span>
            </label>
          </div>
        </div>
      </div>

      {/* Databases */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Bases de Datos</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={data.databases?.includes('mysql') || false}
                onChange={() => handleDatabaseToggle('mysql')}
              />
              <span className="label-text">MySQL</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={data.databases?.includes('postgres') || false}
                onChange={() => handleDatabaseToggle('postgres')}
              />
              <span className="label-text">PostgreSQL</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={data.databases?.includes('mongodb') || false}
                onChange={() => handleDatabaseToggle('mongodb')}
              />
              <span className="label-text">MongoDB</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={data.databases?.includes('redis') || false}
                onChange={() => handleDatabaseToggle('redis')}
              />
              <span className="label-text">Redis</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={data.databases?.includes('sqlserver') || false}
                onChange={() => handleDatabaseToggle('sqlserver')}
              />
              <span className="label-text">SQL Server</span>
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={data.databases?.includes('firebase') || false}
                onChange={() => handleDatabaseToggle('firebase')}
              />
              <span className="label-text">Firebase</span>
            </label>
          </div>
        </div>
      </div>

      {/* Arquitectura */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-medium">Arquitectura Preferida</span>
        </label>
        <select 
          className="select select-bordered w-full"
          value={data.architecture}
          onChange={(e) => handleChange('architecture', e.target.value)}
        >
          <option value="monolith">Monolítica</option>
          <option value="microservices">Microservicios</option>
          <option value="serverless">Serverless</option>
          <option value="hybrid">Híbrida</option>
          <option value="any">Sin preferencia</option>
        </select>
      </div>
    </div>
  );
}
