import React from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Shield,
  AlertCircle,
  Scan,
  Cpu,
  Sprout
} from 'lucide-react';
import { PredictionResult as PredictionResultType } from '../../types';

interface PredictionResultProps {
  result: PredictionResultType | null;
  loading?: boolean;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({ result, loading = false }) => {
  const isHealthy = result?.disease?.toLowerCase() === 'healthy';

  const formatDisease = (disease: string) => {
    return disease
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <div className="glass-panel prediction-result-card">
      {/* CARD TITLE ROW */}
      <div className="card-title-row">
        <h3>
          <Activity size={20} className="text-purple" />
          <span>Prediction Result</span>
        </h3>
        {result && !loading && (
          <span className={`badge ${isHealthy ? 'badge-healthy' : 'badge-disease'}`}>
            {isHealthy ? (
              <>
                <CheckCircle2 size={13} style={{ marginRight: '4px' }} />
                <span>Healthy Pomegranate</span>
              </>
            ) : (
              <>
                <AlertTriangle size={13} style={{ marginRight: '4px' }} />
                <span>Disease Detected</span>
              </>
            )}
          </span>
        )}
      </div>

      {/* 1. LOADING / ANALYZING STATE */}
      {loading && (
        <div className="prediction-empty-state analyzing-active-state">
          <div className="radar-scanner-box">
            <div className="radar-sweep-beam" />
            <Cpu size={32} className="radar-center-icon text-purple" />
          </div>
          <div className="analyzing-state-title">
            Analyzing Image...
          </div>
          <p className="analyzing-state-sub">
            FarmVision AI is examining the image for disease patterns.
          </p>
          <div className="analyzing-progress-pill">
            <span className="live-dot" />
            <span>ResNet-50 Convolutional Feature Extraction</span>
          </div>
        </div>
      )}

      {/* 2. EMPTY STATE (BEFORE PREDICTION) */}
      {!loading && !result && (
        <div className="prediction-empty-state">
          <div className="prediction-empty-icon">
            <Scan size={32} className="text-purple" />
          </div>
          <div className="empty-state-title">
            No prediction yet
          </div>
          <p className="empty-state-sub">
            Upload a pomegranate image to begin analysis.
          </p>
          <div className="empty-state-guidance">
            <span className="guidance-dot" />
            <span>Supported: Fruit surfaces & orchard foliage</span>
          </div>
        </div>
      )}

      {/* 3. PREDICTION RESULT DISPLAY */}
      {!loading && result && (
        <div className="prediction-result-content">
          {/* PRIMARY STATUS BANNER */}
          <div
            className={`result-status-banner ${isHealthy ? 'status-banner-healthy' : 'status-banner-disease'}`}
          >
            <div className="status-banner-info">
              <div className="status-banner-label">
                {isHealthy ? 'Crop Health Status' : 'Disease Detected'}
              </div>
              <div className="status-banner-title">
                {isHealthy ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sprout size={22} className="text-healthy" />
                    <span>Healthy Pomegranate</span>
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={22} className="text-disease" />
                    <span>{formatDisease(result.disease)}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="status-banner-metric">
              <div className="status-metric-label">AI Confidence</div>
              <div className="status-metric-value">{result.confidence}%</div>
            </div>
          </div>

          {/* DIAGNOSIS DETAIL BOX */}
          <div className="result-detail-box">
            <div className="result-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={13} className="text-purple" />
                <span>Diagnosis Summary</span>
              </span>
            </div>
            <div className="result-value">
              {result.diagnosis || (isHealthy ? 'No disease detected. The pomegranate specimen appears sound and vigorous.' : 'Pathogenic infection symptoms detected.')}
            </div>
          </div>

          {/* RECOMMENDED TREATMENT / PESTICIDE */}
          <div className="result-detail-box">
            <div className="result-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Shield size={13} className="text-purple" />
                <span>{isHealthy ? 'Recommended Maintenance' : 'Recommended Treatment / Pesticide'}</span>
              </span>
            </div>
            <div className="result-value">
              {result.recommended_pesticide || (isHealthy ? 'Maintain balanced nitrogen, phosphorus, and potassium fertilization with regular drip irrigation.' : 'Apply targeted fungicides according to local agronomic extension guidelines.')}
            </div>
          </div>

          {/* PRECAUTIONS & CULTURAL CARE */}
          <div className="result-detail-box">
            <div className="result-label">
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <AlertCircle size={13} className="text-purple" />
                <span>Orchard Precautions & Cultural Care</span>
              </span>
            </div>
            <div className="result-value">
              {result.precaution || 'Ensure proper tree aeration, avoid overhead sprinkler wetting, and monitor orchard rows regularly.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;
