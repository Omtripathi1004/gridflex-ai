'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { fetchShapExplanations } from '../../lib/api';
import { MetricCard } from '../../components/MetricCard';
import { 
  Cpu, 
  Sun, 
  TrendingDown, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from 'recharts';

export default function ExplainableAIPage() {
  const { t } = useLanguage();
  const [shapData, setShapData] = useState<any>(null);

  useEffect(() => {
    fetchShapExplanations().then(data => {
      if (data) setShapData(data);
    });
  }, []);

  const solarShap = shapData?.solar_forecast_shap || {
    target: "Solar Output at 13:00",
    base_value_mw: 22.0,
    predicted_value_mw: 42.5,
    plain_english_summary: "The +20.5 MW boost above baseline is predominantly driven by peak GHI irradiance (+16.8 MW) and optimal sun azimuth (+8.4 MW), slightly penalized by high cell temperature (-3.6 MW).",
    features: [
      { feature: "GHI Solar Irradiance (840 W/m²)", contribution_mw: 16.8, direction: "positive" },
      { feature: "Solar Zenith Angle (Sun Peak)", contribution_mw: 8.4, direction: "positive" },
      { feature: "Clear Skies (18% Cloud Cover)", contribution_mw: 3.2, direction: "positive" },
      { feature: "Cell Temperature Derating (42°C)", contribution_mw: -3.6, direction: "negative" },
      { feature: "Aerosol Optical Depth / Dust", contribution_mw: -1.3, direction: "negative" },
      { feature: "7-Day Historical Clear-Sky Lag", contribution_mw: -3.0, direction: "negative" }
    ]
  };

  const deficitShap = shapData?.evening_deficit_shap || {
    target: "Net Energy Balance at 19:30",
    base_value_mw: -4.0,
    predicted_value_mw: -18.2,
    plain_english_summary: "The critical -18.2 MW deficit is created by the coincidence of solar generation collapsing to zero (-9.8 MW) precisely as residential domestic loads spike (-7.2 MW) and commuter EVs connect (-3.4 MW).",
    features: [
      { feature: "Sunset Cliff (Solar Drops to 0)", contribution_mw: -9.8, direction: "negative" },
      { feature: "Residential HVAC & Cooking Peak", contribution_mw: -7.2, direction: "negative" },
      { feature: "Commuter EV Charging Ramp-Up", contribution_mw: -3.4, direction: "negative" },
      { feature: "Coastal Breeze Wind Pick-up", contribution_mw: 4.1, direction: "positive" },
      { feature: "Commercial Lighting Auto-Dim", contribution_mw: 2.1, direction: "positive" }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1>{t('xai.title')}</h1>
            <span className="badge badge-forecast">{t('xai.explainer_badge')}</span>
          </div>
          <p>{t('xai.subtitle')}</p>
        </div>

        <span className="badge badge-live">
          <CheckCircle2 size={13} /> {t('xai.tooltip')}
        </span>
      </div>

      {/* Solar Forecast SHAP Breakdown */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <Sun size={20} style={{ color: 'var(--amber-flow)' }} />
              {t('xai.solar_title')}
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: 4 }}>
              {t('xai.base_value')}: <strong>{solarShap.base_value_mw} MW</strong> ➔ {t('xai.predicted_value')}: <strong style={{ color: 'var(--amber-flow)' }}>{solarShap.predicted_value_mw} MW</strong>
            </p>
          </div>
          <span className="badge badge-sim">{t('xai.solar_model_badge')}</span>
        </div>

        {/* Plain English Explanation */}
        <div style={{
          background: 'rgba(251, 191, 36, 0.08)',
          border: '1px solid rgba(251, 191, 36, 0.25)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: 16,
          fontSize: '0.88rem',
          color: '#f8fafc'
        }}>
          <Sparkles size={16} style={{ color: 'var(--amber-flow)', verticalAlign: 'middle', marginRight: 6 }} />
          <strong>{t('xai.operator_summary')}</strong> {solarShap.plain_english_summary}
        </div>

        {/* Feature Contribution Horizontal Bar Chart */}
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={solarShap.features} 
              layout="vertical" 
              margin={{ top: 5, right: 30, left: 180, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" horizontal={false} />
              <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" MW" />
              <YAxis type="category" dataKey="feature" stroke="#64748b" tick={{ fill: '#f8fafc', fontSize: 11 }} width={170} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0d1424', 
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  color: '#f8fafc' 
                }} 
              />
              <Bar dataKey="contribution_mw" name={t('xai.chart_shap')}>
                {solarShap.features.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.contribution_mw >= 0 ? '#10b981' : '#ef4444'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Evening Deficit SHAP Breakdown */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <TrendingDown size={20} style={{ color: 'var(--red-risk)' }} />
              {t('xai.deficit_title')}
            </h3>
            <p style={{ fontSize: '0.82rem', marginTop: 4 }}>
              {t('xai.base_value')}: <strong>{deficitShap.base_value_mw} MW</strong> ➔ {t('xai.predicted_value')}: <strong style={{ color: 'var(--red-risk)' }}>{deficitShap.predicted_value_mw} MW</strong>
            </p>
          </div>
          <span className="badge badge-risk-critical">{t('xai.deficit_model_badge')}</span>
        </div>

        {/* Plain English Explanation */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          marginBottom: 16,
          fontSize: '0.88rem',
          color: '#f8fafc'
        }}>
          <Sparkles size={16} style={{ color: 'var(--red-risk)', verticalAlign: 'middle', marginRight: 6 }} />
          <strong>{t('xai.operator_summary')}</strong> {deficitShap.plain_english_summary}
        </div>

        {/* Feature Contribution Horizontal Bar Chart */}
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={deficitShap.features} 
              layout="vertical" 
              margin={{ top: 5, right: 30, left: 180, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" horizontal={false} />
              <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit=" MW" />
              <YAxis type="category" dataKey="feature" stroke="#64748b" tick={{ fill: '#f8fafc', fontSize: 11 }} width={170} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0d1424', 
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  color: '#f8fafc' 
                }} 
              />
              <Bar dataKey="contribution_mw" name={t('xai.chart_shap')}>
                {deficitShap.features.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.contribution_mw >= 0 ? '#10b981' : '#ef4444'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
