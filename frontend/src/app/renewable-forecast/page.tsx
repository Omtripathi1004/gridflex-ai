'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchRenewableForecast } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { 
  Sun, 
  Wind, 
  CloudRain, 
  Thermometer, 
  Gauge, 
  LineChart, 
  Info,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export default function RenewableForecastPage() {
  const { t } = useLanguage();
  const [forecastData, setForecastData] = useState<any>(null);
  const [horizon, setHorizon] = useState<number>(24);

  useEffect(() => {
    fetchRenewableForecast(horizon).then(data => setForecastData(data));
  }, [horizon]);

  const series = forecastData?.forecast_series || [];
  const metrics = forecastData?.metrics || {
    solar_mae_mw: 1.42,
    solar_rmse_mw: 2.18,
    solar_r2_score: 0.942,
    wind_mae_mw: 1.15,
    wind_rmse_mw: 1.76,
    wind_r2_score: 0.915
  };

  const currentWeather = series[12]?.weather || {
    ghi_w_m2: 840,
    temperature_c: 28.5,
    cloud_cover_pct: 18,
    wind_speed_ms: 6.8
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>{t('rf.title')}</h1>
            <span className="badge badge-forecast">{t('badge.forecast')}</span>
          </div>
          <p>{t('rf.subtitle')}</p>
        </div>

        {/* Horizon selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-tertiary)', padding: 4, borderRadius: 'var(--radius-md)' }}>
          <button
            onClick={() => setHorizon(24)}
            className={`btn btn-sm ${horizon === 24 ? 'btn-primary' : 'btn-secondary'}`}
          >
            24-Hour Horizon
          </button>
          <button
            onClick={() => setHorizon(48)}
            className={`btn btn-sm ${horizon === 48 ? 'btn-primary' : 'btn-secondary'}`}
          >
            48-Hour Horizon
          </button>
        </div>
      </div>

      {/* Model Performance Scorecards */}
      <div className="grid-3">
        <MetricCard
          label={`${t('rf.mae')} (Solar / Wind)`}
          value={`${metrics.solar_mae_mw} / ${metrics.wind_mae_mw}`}
          unit="MW"
          meta="Tested against 2026 validation split"
          icon={Gauge}
          variant="cyan"
        />
        <MetricCard
          label={`${t('rf.rmse')} (Solar / Wind)`}
          value={`${metrics.solar_rmse_mw} / ${metrics.wind_rmse_mw}`}
          unit="MW"
          meta="Outlier penalty normalized"
          icon={LineChart}
          variant="amber"
        />
        <MetricCard
          label={`${t('rf.r2')} Score`}
          value={`${metrics.solar_r2_score}`}
          meta="Variance explained: 94.2%"
          icon={Info}
          variant="green"
        />
      </div>

      {/* Main Forecast Chart with Confidence Intervals */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Sun size={20} style={{ color: 'var(--amber-flow)' }} />
              {t('rf.chart_title')}
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: 4 }}>
              Showing LightGBM day-ahead solar & wind forecast, 95% upper/lower confidence bounds, and recorded actuals.
            </p>
          </div>
          <span className="badge badge-forecast">LightGBM v2.4</span>
        </div>

        <div style={{ width: '100%', height: 380, marginTop: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" MW" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0d1424', 
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  color: '#f8fafc' 
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />

              {/* 95% Confidence Interval Area */}
              <Area
                type="monotone"
                dataKey="solar_upper_95"
                name="Solar 95% Upper Bound"
                stroke="transparent"
                fill="rgba(251, 191, 36, 0.12)"
              />
              <Area
                type="monotone"
                dataKey="solar_lower_95"
                name="Solar 95% Lower Bound"
                stroke="transparent"
                fill="transparent"
              />

              {/* Solar Prediction Line */}
              <Line
                type="monotone"
                dataKey="solar_predicted"
                name="Solar Predicted (MW)"
                stroke="#fbbf24"
                strokeWidth={2.5}
                dot={false}
              />

              {/* Solar Actual Line */}
              <Line
                type="monotone"
                dataKey="solar_actual"
                name="Solar Actual (Recorded MW)"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#10b981' }}
              />

              {/* Wind Prediction Line */}
              <Line
                type="monotone"
                dataKey="wind_predicted"
                name="Wind Predicted (MW)"
                stroke="#00f0ff"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Atmospheric & Meteorological Inputs */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <CloudRain size={20} style={{ color: 'var(--blue-bright)' }} />
            {t('rf.weather_title')}
          </h3>
          <span className="badge badge-live">Live NWP Station Telemetry</span>
        </div>

        <div className="grid-4">
          <div className="metric-card" style={{ borderColor: 'rgba(251, 191, 36, 0.3)' }}>
            <span className="metric-label"><Sun size={16} style={{ color: 'var(--amber-flow)' }} /> {t('rf.ghi')}</span>
            <div className="metric-val-row">
              <span className="metric-value" style={{ color: 'var(--amber-flow)' }}>{currentWeather.ghi_w_m2}</span>
              <span className="metric-unit">W/m²</span>
            </div>
            <span className="metric-meta">Clear sky index: 0.92</span>
          </div>

          <div className="metric-card" style={{ borderColor: 'rgba(56, 189, 248, 0.3)' }}>
            <span className="metric-label"><Thermometer size={16} style={{ color: '#38bdf8' }} /> {t('rf.temp')}</span>
            <div className="metric-val-row">
              <span className="metric-value" style={{ color: '#38bdf8' }}>{currentWeather.temperature_c}</span>
              <span className="metric-unit">°C</span>
            </div>
            <span className="metric-meta">Cell derating: -2.1%</span>
          </div>

          <div className="metric-card" style={{ borderColor: 'rgba(148, 163, 184, 0.3)' }}>
            <span className="metric-label"><CloudRain size={16} style={{ color: '#94a3b8' }} /> {t('rf.cloud')}</span>
            <div className="metric-val-row">
              <span className="metric-value">{currentWeather.cloud_cover_pct}</span>
              <span className="metric-unit">%</span>
            </div>
            <span className="metric-meta">Cirrus & Cumulus scatter</span>
          </div>

          <div className="metric-card" style={{ borderColor: 'rgba(0, 240, 255, 0.3)' }}>
            <span className="metric-label"><Wind size={16} style={{ color: 'var(--cyan-primary)' }} /> {t('rf.wind_speed')}</span>
            <div className="metric-val-row">
              <span className="metric-value" style={{ color: 'var(--cyan-primary)' }}>{currentWeather.wind_speed_ms}</span>
              <span className="metric-unit">m/s</span>
            </div>
            <span className="metric-meta">Hub height 100m anemometer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
